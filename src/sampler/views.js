import React, { useState } from 'react';

import { BaseNode } from './display';

import { formatTime } from '../misc/util';

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
}) {
    // generate the sources data.
    const [data] = useState(() => {
        // get a list of each distinct source
        const sources = classSources
            ? [...new Set(Object.values(classSources))]
            : [];

        // function to scan a thread for matches
        function findMatches(acc, source, node) {
            if (node.source === source) {
                // if the source of the node matches, add it to the accumulator
                // todo: merge into acc instead?
                acc.push(node);
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
                        out.push(copy);

                        totalTime += acc.reduce((a, c) => a + c.time, 0);
                    }
                }
                return { source, totalTime, threads: out };
            })
            .sort((a, b) => b.totalTime - a.totalTime);
    });

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
