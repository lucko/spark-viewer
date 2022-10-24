// The methods in this class are used to pre-process the raw data
// sent in the proto. The proto data contains only what is necessary, and
// anything that could be computed based on the raw data is excluded.
//
// The preprocessing functions in this file are called async using a webworker
// on initial load. This means the preprocessing can happen in the background
// (it can take up to a few seconds) while the rest of the page remains responsive.

import { expose } from 'comlink';
import type {
    ExtendedStackTraceNode,
    StackTraceNodeWithId,
    StackTraceNodeWithParents,
    StackTraceNodeWithSource,
    ThreadNodeWithSourceTime,
} from '../../../proto/nodes';
import type {
    SamplerData,
    StackTraceNode,
    ThreadNode,
} from '../../../proto/spark_pb';

// Expose methods via comlink
const exports = { generateFlatView, generateSourceViews };
export type PreprocessingWorker = typeof exports;
expose(exports);

// Utility function to merge a node into an existing
// map of nodes if an existing node in the map
// has the same className+methodName+methodDesc
function mergeIntoAccumulator<T extends StackTraceNode>(
    map: Map<string, T>,
    node: T
) {
    const key = keyForNode(node);
    const existing = map.get(key);
    if (existing !== undefined) {
        map.set(key, mergeNodes(existing, node) as unknown as T);
    } else {
        map.set(key, node);
    }
}

// Merges two nodes together into a new node.
function mergeNodes(
    a: StackTraceNode,
    b: StackTraceNode
): ExtendedStackTraceNode {
    const childrenMap = new Map();
    for (const c of a.children) {
        mergeIntoAccumulator(childrenMap, c);
    }
    for (const c of b.children) {
        mergeIntoAccumulator(childrenMap, c);
    }
    const children = Array.from(childrenMap.values());
    children.sort((a, b) => b.time - a.time);

    let parents: StackTraceNode[] = [];
    if ((a as StackTraceNodeWithParents).parents) {
        parents = parents.concat(
            (a as StackTraceNodeWithParents).parents,
            (b as StackTraceNodeWithParents).parents
        );
        parents.sort((a, b) => b.time - a.time);
    }

    let ids: number[] = [];
    ids = ids.concat(
        (a as StackTraceNodeWithId).id,
        (b as StackTraceNodeWithId).id
    );

    return {
        className: a.className,
        methodName: a.methodName,
        methodDesc: a.methodDesc,
        lineNumber: a.lineNumber,
        parentLineNumber: 0,
        source: (a as StackTraceNodeWithSource).source,
        time: a.time + b.time,
        times: mergeTimes(a.times, b.times),
        id: ids,
        children,
        parents,
    };
}

function mergeTimes(a: number[], b: number[]): number[] {
    if (!a) return [];

    const combined = Array.from(a);
    for (let i = 0; i < combined.length; i++) {
        combined[i] = combined[i] + b[i];
    }
    return combined;
}

// Creates a copy of a node
function shallowCopy(n: ExtendedStackTraceNode): ExtendedStackTraceNode {
    return {
        className: n.className,
        methodName: n.methodName,
        methodDesc: n.methodDesc,
        lineNumber: n.lineNumber,
        parentLineNumber: n.parentLineNumber,
        source: (n as StackTraceNodeWithSource).source,
        time: n.time,
        times: n.times,
        id: (n as StackTraceNodeWithId).id,
        children: n.children,
        parents: (n as StackTraceNodeWithParents).parents,
    };
}

function keyForNode(node: StackTraceNode) {
    return `${node.className}\0${node.methodName}\0${node.methodDesc}`;
}

// Generates the data required by the viewer "Flat View".
// It shows a flattened representation of the profile where the
// slowest x methods invocations are displayed at the top level.
//
// The view also allows for the nodes to be displayed "top down"
// or "bottom up", and be sorted according to node self-time or
// total-time.

export interface FlatViewDataContainer {
    flatSelfTime?: ThreadNode[];
    flatTotalTime?: ThreadNode[];
}

function generateFlatView(data: SamplerData): FlatViewDataContainer {
    const { threads } = data;

    interface NodeAccumulator {
        nodes: StackTraceNode[];
        selfTime: number;
        totalTime: number;
    }

    interface BasicSet<T> {
        add: (el: T) => void;
        delete: (el: T) => void;
        has: (el: T) => boolean;
    }

    // Visits a node in the profiler tree, calculates data
    // about it then appends it to the accumulator
    function visit(
        node: StackTraceNode,
        parent: StackTraceNode | undefined,
        acc: Map<string, NodeAccumulator>,
        seen: BasicSet<string>
    ) {
        const key = keyForNode(node);
        const skip = seen.has(key);
        if (!skip) {
            seen.add(key);
        }

        // process children
        let childTime = 0;
        for (const child of node.children) {
            childTime += visit(child, node, acc, seen);
        }

        if (!skip) {
            seen.delete(key);
        }

        // calculate self time
        const selfTime = node.time - childTime;

        // store back-ref to parent
        // this is used by the bottom-up view
        (node as StackTraceNodeWithParents).parents = parent ? [parent] : [];

        if (!skip) {
            // Obtain an accumulator for the node
            // nodes with the same className+methodName+methodDesc should
            // use the same accumulator...
            let nodeAcc = acc.get(key);
            if (!nodeAcc) {
                nodeAcc = {
                    nodes: [],
                    selfTime: 0,
                    totalTime: 0,
                };
                acc.set(key, nodeAcc);
            }

            // Append the node to its accumulator
            nodeAcc.nodes.push(node);
            nodeAcc.selfTime += selfTime;
            nodeAcc.totalTime += node.time;
        }

        // return the node time to assist calculating the
        // self-time (see above) inline.
        return node.time;
    }

    // Given a flattened map of nodes for the given thread,
    // generate an array of the top x nodes according to either
    // the selfTime or totalTime (controlled by the selfMode parameter)
    function generate(thread: ThreadNode, selfMode: boolean, size: number) {
        const flattened = new Map();
        let seen: BasicSet<string>;
        if (selfMode) {
            seen = {
                add: _ => {},
                delete: _ => {},
                has: _ => false,
            };
        } else {
            seen = new Set();
        }

        for (const node of thread.children) {
            visit(node, undefined, flattened, seen);
        }

        // define a sort function for the flattened nodes
        const sortFunc: (a: NodeAccumulator, b: NodeAccumulator) => number =
            selfMode
                ? (a, b) => b.selfTime - a.selfTime
                : (a, b) => b.totalTime - a.totalTime;

        // sort'n'slice the map into an array
        const flattenedArray = Array.from(flattened.values())
            .sort(sortFunc)
            .slice(0, size);

        // iterate through the flattened array and construct
        // a merged node to represent each entry
        let acc = [];
        for (const { nodes, totalTime } of flattenedArray) {
            let base = shallowCopy(nodes[0]);
            for (const other of nodes.slice(1)) {
                base = mergeNodes(base, other);
            }
            base.time = totalTime;
            acc.push(base);
        }

        // create a copy of the thread object with the
        // generated nodes as its children
        let copy = Object.assign({}, thread);
        copy.children = acc;
        return copy;
    }

    const outSelf = [];
    const outTotal = [];

    for (const thread of threads) {
        outSelf.push(generate(thread, true, 250));
        outTotal.push(generate(thread, false, 250));
    }

    return {
        flatSelfTime: outSelf,
        flatTotalTime: outTotal,
    };
}

export interface SourcesViewDataContainer {
    sourcesMerged?: SourcesViewData[];
    sourcesSeparate?: SourcesViewData[];
}

export interface SourcesViewData {
    source: string;
    totalTime: number;
    threads: ThreadNodeWithSourceTime[];
}

// Generates the data required by the viewer "Sources View".
// It shows a filtered representation of the profile broken down
// by plugin/mod (source).
function generateSourceViews(data: SamplerData): SourcesViewDataContainer {
    if (!data.classSources && !data.methodSources && !data.lineSources) {
        return {};
    }

    const { classSources, methodSources, lineSources, threads } = data;

    // get a list of each distinct source
    const sources = Array.from(
        new Set([
            ...Object.values(classSources || {}),
            ...Object.values(methodSources || {}),
            ...Object.values(lineSources || {}),
        ])
    );

    // forgive carpet replacing the entire tick loop
    function hideNode(node: StackTraceNodeWithSource) {
        return (
            node.className &&
            node.methodName &&
            node.className.startsWith('net.minecraft.server.MinecraftServer') &&
            (node.methodName.endsWith('modifiedRunLoop') ||
                node.methodName.endsWith('fixUpdateSuppressionCrashTick')) &&
            node.source.includes('carpet')
        );
    }

    // Recursively scan through 'node' until a match for 'source' is found.
    // If found, add the node to the 'acc'-ulmulator using the given 'mergeMode'
    function findMatchesMerge(
        acc: Map<string, StackTraceNode>,
        source: string,
        nodes: StackTraceNode[]
    ) {
        for (const node of nodes) {
            const nodeWithSource = node as StackTraceNodeWithSource;
            if (nodeWithSource.source === source && !hideNode(nodeWithSource)) {
                // if the source of the node matches, add it to the accumulator
                mergeIntoAccumulator(acc, node);
            } else {
                // otherwise, search the nodes children (recursively...)
                findMatchesMerge(acc, source, node.children);
            }
        }
    }

    function findMatchesSeparate(
        acc: Map<number | number[], StackTraceNode>,
        source: string,
        nodes: StackTraceNode[]
    ) {
        for (const node of nodes) {
            const nodeWithSource = node as StackTraceNodeWithSource;
            if (nodeWithSource.source === source && !hideNode(nodeWithSource)) {
                // if the source of the node matches, add it to the accumulator
                acc.set((node as StackTraceNodeWithId).id, node);
            } else {
                // otherwise, search the nodes children (recursively...)
                findMatchesSeparate(acc, source, node.children);
            }
        }
    }

    // Generates a source view using the given merge mode
    // mergeMode = true -  Method calls with the same signature will be merged together,
    //                     even though they may not have been invoked by the same calling method.
    // mergeMode = false - Method calls that have the same signature, but that haven't been invoked
    //                     by the same calling method will show separately.
    function generate(mergeMode: boolean) {
        return sources
            .map(source => {
                const out = [];
                let totalTime = 0;

                for (const thread of threads) {
                    let acc: StackTraceNode[];
                    if (mergeMode) {
                        const accMap = new Map<string, StackTraceNode>();
                        findMatchesMerge(accMap, source, thread.children);
                        acc = Array.from(accMap.values());
                    } else {
                        const accMap = new Map<
                            number | number[],
                            StackTraceNode
                        >();
                        findMatchesSeparate(accMap, source, thread.children);
                        acc = Array.from(accMap.values());
                    }

                    acc.sort((a, b) => b.time - a.time);

                    if (acc.length) {
                        let sourceNode: ThreadNodeWithSourceTime = {
                            ...thread,
                            children: acc,
                            sourceTime: acc.reduce((a, c) => a + c.time, 0),
                        };
                        out.push(sourceNode);
                        totalTime += sourceNode.sourceTime;
                    }
                }

                return { source, totalTime, threads: out };
            })
            .filter(data => data.threads.length && data.totalTime)
            .sort((a, b) => b.totalTime - a.totalTime);
    }

    return {
        sourcesMerged: generate(true),
        sourcesSeparate: generate(false),
    };
}
