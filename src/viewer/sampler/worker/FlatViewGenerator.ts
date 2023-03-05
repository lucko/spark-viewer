import type { StackTraceNodeWithId, ThreadNodeWithId } from '../../proto/nodes';
import NodeAccumulator from '../node/NodeAccumulator';
import type { SamplerWorkerProps } from './SamplerWorker';

export interface FlatViewData {
    flatSelfTime: FlatThreadNode[];
    flatTotalTime: FlatThreadNode[];
}

export interface FlatThreadNode {
    name: string;
    id: number;
    time: number;
    times: number[];
    children: number[][];
}

export default class FlatViewGenerator {
    private readonly threads: ThreadNodeWithId[];

    constructor(props: SamplerWorkerProps) {
        this.threads = props.threads;
    }

    public generateView() {
        const outSelf: FlatThreadNode[] = [];
        const outTotal: FlatThreadNode[] = [];

        for (const thread of this.threads) {
            outSelf.push(this.generate(thread, true, 250));
            outTotal.push(this.generate(thread, false, 250));
        }

        return {
            flatSelfTime: outSelf,
            flatTotalTime: outTotal,
        };
    }

    // Given a flattened map of nodes for the given thread,
    // generate an array of the top x nodes according to either
    // the selfTime or totalTime (controlled by the selfMode parameter)
    private generate(
        thread: ThreadNodeWithId,
        selfMode: boolean,
        size: number
    ): FlatThreadNode {
        const flattened = new Map<string, NodeArrayAccumulator>();
        let seen: BasicSet<string>;
        seen = selfMode ? new NoopSet() : new Set();

        for (const node of thread.children) {
            this.visit(node, flattened, seen);
        }

        // define a sort function for the flattened nodes
        const sortFunc: (
            a: NodeArrayAccumulator,
            b: NodeArrayAccumulator
        ) => number = selfMode
            ? (a, b) => b.selfTime - a.selfTime
            : (a, b) => b.totalTime - a.totalTime;

        // sort'n'slice the map into an array
        const flattenedArray: NodeArrayAccumulator[] = Array.from(
            flattened.values()
        )
            .sort(sortFunc)
            .slice(0, size);

        // iterate through the flattened array and construct
        // a merged node to represent each entry
        let acc: number[][] = [];
        for (const { nodes } of flattenedArray) {
            const nodeIds = nodes.map(node => node.id);
            acc.push(nodeIds);
        }

        return {
            name: thread.name,
            id: thread.id,
            time: thread.time,
            times: thread.times,
            children: acc,
        };
    }

    // Visits a node in the profiler tree, calculates data
    // about it then appends it to the accumulator
    private visit(
        node: StackTraceNodeWithId,
        acc: Map<string, NodeArrayAccumulator>,
        seen: BasicSet<string>
    ) {
        const key = NodeAccumulator.keyForNode(node);
        const skip = seen.has(key);
        if (!skip) {
            seen.add(key);
        }

        // process children
        let childTime = 0;
        for (const child of node.children) {
            this.visit(child, acc, seen);
            childTime += child.time;
        }

        if (!skip) {
            seen.delete(key);
        }

        // calculate self time
        const selfTime = node.time - childTime;

        if (!skip) {
            // Obtain an accumulator for the node
            // nodes with the same className+methodName+methodDesc should
            // use the same accumulator...
            let nodeAcc = acc.get(key);
            if (!nodeAcc) {
                nodeAcc = new NodeArrayAccumulator();
                acc.set(key, nodeAcc);
            }

            // Append the node to its accumulator
            nodeAcc.append(node, selfTime);
        }
    }
}

class NodeArrayAccumulator {
    readonly nodes: StackTraceNodeWithId[] = [];
    selfTime: number = 0;
    totalTime: number = 0;

    public append(node: StackTraceNodeWithId, selfTime: number) {
        this.nodes.push(node);
        this.selfTime += selfTime;
        this.totalTime += node.time;
    }
}

interface BasicSet<T> {
    add(value: T): this;

    delete(value: T): boolean;

    has(value: T): boolean;
}

class NoopSet<T> implements BasicSet<T> {
    add(value: T): this {
        return this;
    }

    delete(value: T): boolean {
        return false;
    }

    has(value: T): boolean {
        return false;
    }
}
