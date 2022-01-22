import React from 'react';

import { BaseNode } from './display';

import { formatTime } from '../misc/util';

export const VIEW_ALL = Symbol();
export const VIEW_FLAT = Symbol();
export const VIEW_SOURCES_SEPARATE = Symbol();
export const VIEW_SOURCES_MERGED = Symbol();
export const VIEWS = [
    VIEW_ALL,
    VIEW_FLAT,
    VIEW_SOURCES_MERGED,
    VIEW_SOURCES_SEPARATE,
];

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

export function FlatView({ threads, mappings, highlighted, searchQuery }) {
    return (
        <div className="sourceview">
            <FlatViewHeader />
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
        </div>
    );
}

// The sampler view in which there is a stack displayed for each known source.
export function SourcesView({
    data,
    mappings,
    view,
    setView,
    highlighted,
    searchQuery,
}) {
    return (
        <div className="sourceview">
            <SourcesViewHeader view={view} setView={setView} />
            <hr />
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

const FlatViewHeader = () => {
    return (
        <div className="header">
            <h2>Flat View</h2>
            <p>
                This view shows a flattened representation of the profile, where
                the slowest 100 method invocations are displayed at the top
                level. Methods are sorted according to their "self time" (the
                time spent executing code within the method).
            </p>
            <p>
                In order to see the method calls that led to the top-level
                invocation, create a bookmark (use the right-click context menu
                or Alt+Click on a frame) then go back to the 'all' view.
            </p>
        </div>
    );
};

const SourcesViewHeader = ({ view, setView }) => {
    function onClick() {
        setView(
            view === VIEW_SOURCES_MERGED
                ? VIEW_SOURCES_SEPARATE
                : VIEW_SOURCES_MERGED
        );
    }

    return (
        <div className="header">
            <h2>Sources View</h2>
            <p>
                This view shows a filtered representation of the profile broken
                down by plugin/mod (source).
            </p>
            <button onClick={onClick}>
                Merge Mode:{' '}
                {view === VIEW_SOURCES_MERGED ? 'Merge' : 'Separate'}
            </button>
            <p>
                <b>
                    {view === VIEW_SOURCES_MERGED ? (
                        <>
                            Method calls with the same signature will be merged
                            together, even though they may not have been invoked
                            by the same calling method.
                        </>
                    ) : (
                        <>
                            Method calls that have the same signature, but that
                            haven't been invoked by the same calling method will
                            show separately.
                        </>
                    )}
                </b>
            </p>
        </div>
    );
};
