// The methods in this class are used to pre-process the raw data
// sent in the proto. The proto data contains only what is necessary, and
// anything that could be computed based on the raw data is excluded.
//
// The preprocessing functions in this file are called async using a webworker
// on initial load. This means the preprocessing can happen in the background
// (it can take up to a few seconds) while the rest of the page remains responsive.

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
function shallowCopy(n) {
    return {
        className: n.className,
        methodName: n.methodName,
        methodDesc: n.methodDesc,
        lineNumber: n.lineNumber,
        parentLineNumber: n.parentLineNumber,
        source: n.source,
        time: n.time,
        id: n.id,
        children: n.children,
        parents: n.parents,
    };
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
    function visit(node, parent, acc, seen) {
        const key = `${node.className}\0${node.methodName}\0${node.methodDesc}`;
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
        node.parents = parent ? [parent] : [];

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
    function generate(thread, selfMode, size) {
        const flattened = new Map();
        let seen;
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
        const sortFunc = selfMode
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

    return {
        sourcesMerged: generate(true),
        sourcesSeparate: generate(false),
    };
}
