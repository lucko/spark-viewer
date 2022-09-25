// The methods in this class are used to pre-process the raw data
// sent in the proto. The proto data contains only what is necessary, and
// anything that could be computed based on the raw data is excluded.
//
// The preprocessing happens once, ahead of time when the data is first loaded.
// This means that there is a slightly longer initial delay in loading (in
// practice only a few milliseconds) - but the viewer interactions should then
// be nice and snappy because the data it needs has been pre-computed.

import { releaseProxy, wrap } from 'comlink';

// Creates a wrapped web-worker for more complex preprocessing
export function createWorker(func) {
    const worker = new Worker(
        new URL('./preprocessingWorker.js', import.meta.url)
    );
    const proxy = wrap(worker);
    func(proxy);
    proxy[releaseProxy]();
}

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

// Uses the 'data.<type>Sources' maps to annotate node objects with their source.
// This saves the need for the source information to be duplicated across lots of
// nodes with the same class.
export function labelDataWithSource(data) {
    const excludes = node =>
        node.className.startsWith(
            'com.destroystokyo.paper.event.executor.asm.generated.'
        );

    function visit(sources, nodes) {
        for (const node of nodes) {
            if (node.className && !excludes(node)) {
                let source;

                // methodSources
                if (
                    sources.methodSources &&
                    node.methodName &&
                    node.methodDesc
                ) {
                    const key = `${node.className};${node.methodName};${node.methodDesc}`;
                    source = sources.methodSources[key];
                }

                // lineSources
                if (!source && sources.lineSources && node.lineNumber) {
                    const key = `${node.className};${node.lineNumber}`;
                    source = sources.lineSources[key];
                }

                // classSources
                if (!source && sources.classSources) {
                    source = sources.classSources[node.className];
                }

                if (source && !['minecraft', 'java'].includes(source)) {
                    node.source = source;
                }
            }

            // recursively
            visit(sources, node.children);
        }
    }

    if (data.classSources || data.methodSources || data.lineSources) {
        const sources = {
            classSources: data.classSources,
            methodSources: data.methodSources,
            lineSources: data.lineSources,
        };

        for (const thread of data.threads) {
            visit(sources, thread.children);
        }
    }
}
