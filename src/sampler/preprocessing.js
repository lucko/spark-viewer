// The methods in this class are used to pre-process the raw data
// sent in the proto. The proto data contains only what is necessary, and
// anything that could be computed based on the raw data is excluded.
//
// The preprocessing happens once, ahead of time when the data is first loaded.
// This means that there is a slightly longer initial delay in loading (in
// practice only a few milliseconds) - but the viewer interactions should then
// be nice and snappy because the data it needs has been pre-computed.

// Deterministically assigns a unique integer id to each node in the data.
// This is used primarily for bookmarks (the 'id' of the node is added as
// a query param in the URL), so the that's why the generation of ids needs
// to be deterministic
export function labelData(nodes, i) {
    for (const n of nodes) {
        n.id = i++;
    }
    for (const n of nodes) {
        if (n.children) {
            i = labelData(n.children, i);
        }
    }
    return i;
}

// Uses the 'data.classSources' map to annotate node objects with their source.
// This saves the need for the source information to be duplicated across lots of
// nodes with the same class.
export function labelDataWithSource(data) {
    function visit(sources, nodes) {
        for (const node of nodes) {
            if (
                node.className &&
                !node.className.startsWith(
                    'com.destroystokyo.paper.event.executor.asm.generated.'
                )
            ) {
                const source = sources[node.className];
                if (source) {
                    node.source = source;
                }
            }
            visit(sources, node.children);
        }
    }

    if (data.classSources) {
        for (const thread of data.threads) {
            visit(data.classSources, thread.children);
        }
    }
}

// Utility function to merge a node into an existing
// array of nodes if an existing node in the array
// has the same className+methodName+methodDesc
function mergeIntoArray(arr, node) {
    for (const [i, n] of arr.entries()) {
        if (
            n.className === node.className &&
            n.methodName === node.methodName &&
            n.methodDesc === node.methodDesc
        ) {
            // merge
            arr[i] = mergeNodes(n, node);
            return;
        }
    }

    // just append
    arr.push(node);
}

// Merges two nodes together into a new node.
function mergeNodes(a, b) {
    const children = [];
    for (const c of a.children) {
        mergeIntoArray(children, c);
    }
    for (const c of b.children) {
        mergeIntoArray(children, c);
    }
    children.sort((a, b) => b.time - a.time);

    let parents;
    if (a.parents) {
        parents = [].concat(a.parents, b.parents);
        parents.sort((a, b) => b.time - a.time);
    }

    return {
        className: a.className,
        methodName: a.methodName,
        methodDesc: a.methodDesc,
        lineNumber: a.lineNumber,
        parentLineNumber: 0,
        source: a.source,
        time: a.time + b.time,
        id: [].concat(a.id, b.id),
        children,
        parents,
    };
}

// Creates a copy of a node
function copyNode(n) {
    return mergeNodes(n, {
        time: 0,
        id: [],
        children: [],
        parents: [],
    });
}

// Generates the data required by the viewer "Flat View".
// It shows a flattened representation of the profile where the
// slowest x methods invocations are displayed at the top level.
//
// The view also allows for the nodes to be displayed "top down"
// or "bottom up", and be sorted according to node self-time or
// total-time.
export function generateFlatView(data) {
    const { threads } = data;

    // Visits a node in the profiler tree, calculates data
    // about it then appends it to the accumulator
    function visit(node, parent, acc) {
        // process children
        let childTime = 0;
        for (const child of node.children) {
            childTime += visit(child, node, acc);
        }

        // calculate self time
        const selfTime = node.time - childTime;

        // store back-ref to parent
        // this is used by the bottom-up view
        node.parents = parent ? [parent] : [];

        // Obtain an accumulator for the node
        // nodes with the same className+methodName+methodDesc should
        // use the same accumulator...
        const key = `${node.className}\0${node.methodName}\0${node.methodDesc}`;
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

        // return the node time to assist calculating the
        // self-time (see above) inline.
        return node.time;
    }

    // Given a flattened map of nodes for the given thread,
    // generate an array of the top x nodes according to either
    // the selfTime or totalTime (controlled by the selfMode parameter)
    function generate(thread, flattened, selfMode) {
        // define a sort function for the flattened nodes
        const sortFunc = selfMode
            ? (a, b) => b.selfTime - a.selfTime
            : (a, b) => b.totalTime - a.totalTime;

        // sort'n'slice the map into an array
        const flattenedArray = Array.from(flattened.values())
            .sort(sortFunc)
            .slice(0, 100);

        // iterate through the flattened array and construct
        // a merged node to represent each entry
        let acc = [];
        for (const { nodes, selfTime, totalTime } of flattenedArray) {
            let base = copyNode(nodes[0]);
            for (const other of nodes.slice(1)) {
                base = mergeNodes(base, other);
            }
            base.time = selfMode ? selfTime : totalTime;
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
        const flattened = new Map();

        for (const node of thread.children) {
            visit(node, undefined, flattened);
        }

        outSelf.push(generate(thread, flattened, true));
        outTotal.push(generate(thread, flattened, false));
    }

    data.flatSelfTime = outSelf;
    data.flatTotalTime = outTotal;
}

// Generates the data required by the viewer "Sources View".
// It shows a filtered representation of the profile broken down
// by plugin/mod (source).
export function generateSourceViews(data) {
    if (!data.classSources) {
        return;
    }

    const { classSources, threads } = data;

    // get a list of each distinct source
    const sources = classSources
        ? [...new Set(Object.values(classSources))]
        : [];

    // Recursively scan through 'node' until a match for 'source' is found.
    // If found, add the node to the 'acc'-ulmulator using the given 'mergeMode'
    function findMatches(acc, mergeMode, source, node) {
        if (node.source === source) {
            // if the source of the node matches, add it to the accumulator
            if (mergeMode) {
                mergeIntoArray(acc, node);
            } else {
                acc.push(node);
            }
        } else {
            // otherwise, search the nodes children (recursively...)
            for (const child of node.children) {
                findMatches(acc, mergeMode, source, child);
            }
        }
    }

    // Generates a source view using the given merge mode
    // mergeMode = true -  Method calls with the same signature will be merged together,
    //                     even though they may not have been invoked by the same calling method.
    // mergeMode = false - Method calls that have the same signature, but that haven't been invoked
    //                     by the same calling method will show separately.
    function generate(mergeMode) {
        return sources
            .map(source => {
                const out = [];
                let totalTime = 0;

                for (const thread of threads) {
                    const acc = [];
                    findMatches(acc, mergeMode, source, thread);
                    acc.sort((a, b) => b.time - a.time);

                    if (acc.length) {
                        let copy = Object.assign({}, thread);
                        copy.children = acc;
                        copy.sourceTime = acc.reduce((a, c) => a + c.time, 0);

                        out.push(copy);
                        totalTime += copy.sourceTime;
                    }
                }

                return { source, totalTime, threads: out };
            })
            .sort((a, b) => b.totalTime - a.totalTime);
    }

    data.bySource = generate(true);
    data.bySourceSeparate = generate(false);
}
