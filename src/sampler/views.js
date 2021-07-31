import React, { useMemo } from 'react';

import { BaseNode } from './display';

import { formatTime } from '../misc/util';

export const VIEW_ALL = Symbol();
export const VIEW_SOURCES_SEPARATE = Symbol();
export const VIEW_SOURCES_MERGED = Symbol();
export const VIEWS = [VIEW_ALL, VIEW_SOURCES_MERGED, VIEW_SOURCES_SEPARATE];

// The sampler view in which all data is shown in one, single stack.
export function AllView({ threads, mappings, highlighted, searchQuery }) {
    return (
        <div className="stack">
            {threads.map(thread => (
                <BaseNode
                    parents={[]}
                    node={thread}
                    mappings={mappings}
                    highlighted={highlighted}
                    searchQuery={searchQuery}
                    key={thread.name}
                />
            ))}
        </div>
    );
}

// The sampler view in which there is a stack displayed for each known source.
export function SourcesView({
    classSources,
    threads,
    mappings,
    highlighted,
    searchQuery,
    mergeMode,
}) {
    // generate the sources data.
    const data = useMemo(() => {
        // get a list of each distinct source
        const sources = classSources
            ? [...new Set(Object.values(classSources))]
            : [];

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

        function mergeNodes(a, b) {
            const children = [];
            for (const c of a.children) {
                mergeIntoArray(children, c);
            }
            for (const c of b.children) {
                mergeIntoArray(children, c);
            }
            children.sort((a, b) => b.time - a.time);

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
            };
        }

        // function to scan a thread for matches
        function findMatches(acc, source, node) {
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
                    findMatches(acc, source, child);
                }
            }
        }

        return sources
            .map(source => {
                const out = [];
                let totalTime = 0;
                for (const thread of threads) {
                    const acc = [];
                    findMatches(acc, source, thread);
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
    }, [classSources, threads, mergeMode]);

    return (
        <div className="sourceview">
            {data.map(({ source, totalTime, threads }) => (
                <SourceSection
                    source={source}
                    totalTime={totalTime}
                    threads={threads}
                    mappings={mappings}
                    highlighted={highlighted}
                    searchQuery={searchQuery}
                    key={source}
                />
            ))}
        </div>
    );
}

const SourceSection = ({
    source,
    totalTime,
    threads,
    mappings,
    highlighted,
    searchQuery,
}) => {
    return (
        <div className="stack">
            <h2>
                {source}{' '}
                <span className="time">({formatTime(totalTime)}ms)</span>
            </h2>
            {threads.map(thread => (
                <BaseNode
                    parents={[]}
                    node={thread}
                    searchQuery={searchQuery}
                    highlighted={highlighted}
                    mappings={mappings}
                    isSourceRoot={true}
                    key={thread.name}
                />
            ))}
        </div>
    );
};
