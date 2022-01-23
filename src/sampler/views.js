import React, { createContext, useState } from 'react';

import { BaseNode } from './display';

import { formatTime } from '../misc/util';

export const VIEW_ALL = Symbol();
export const VIEW_FLAT = Symbol();
export const VIEW_SOURCES = Symbol();
export const VIEWS = [VIEW_ALL, VIEW_FLAT, VIEW_SOURCES];

export const BottomUpContext = createContext(false);

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

// The sampler view in which the stack is flattened to the top x nodes
// according to total time or self time.
export function FlatView({
    dataSelfTime,
    dataTotalTime,
    mappings,
    highlighted,
    searchQuery,
}) {
    const [bottomUp, setBottomUp] = useState(true);
    const [selfTimeMode, setSelfTimeMode] = useState(false);
    const data = selfTimeMode ? dataSelfTime : dataTotalTime;

    return (
        <div className="sourceview">
            <FlatViewHeader
                bottomUp={bottomUp}
                setBottomUp={setBottomUp}
                selfTimeMode={selfTimeMode}
                setSelfTimeMode={setSelfTimeMode}
            />
            <hr />
            <div className="stack">
                <BottomUpContext.Provider value={bottomUp}>
                    {data.map(thread => (
                        <BaseNode
                            parents={[]}
                            node={thread}
                            mappings={mappings}
                            highlighted={highlighted}
                            searchQuery={searchQuery}
                            key={thread.name}
                        />
                    ))}
                </BottomUpContext.Provider>
            </div>
        </div>
    );
}

// The sampler view in which there is a stack displayed for each known source.
export function SourcesView({
    dataMerged,
    dataSeparate,
    mappings,
    highlighted,
    searchQuery,
}) {
    const [merged, setMerged] = useState(true);
    const data = merged ? dataMerged : dataSeparate;

    return (
        <div className="sourceview">
            <SourcesViewHeader merged={merged} setMerged={setMerged} />
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

const FlatViewHeader = ({
    bottomUp,
    setBottomUp,
    selfTimeMode,
    setSelfTimeMode,
}) => {
    function onClickDisplay() {
        setBottomUp(!bottomUp);
    }

    function onClickSortMode() {
        setSelfTimeMode(!selfTimeMode);
    }

    return (
        <div className="header">
            <h2>Flat View</h2>
            <p>
                This view shows a flattened representation of the profile, where
                the slowest 100 method invocations are displayed at the top
                level.
            </p>

            <button onClick={onClickDisplay}>
                Display: {bottomUp ? 'Bottom Up' : 'Top Down'}
            </button>
            {bottomUp ? (
                <p style={{ fontWeight: 'bold' }}>
                    The call tree is reversed - expanding a node reveals the
                    method that called it.
                </p>
            ) : (
                <p style={{ fontWeight: 'bold' }}>
                    The call tree is "normal" - expanding a node reveals the
                    sub-methods that it calls.
                </p>
            )}

            <button onClick={onClickSortMode}>
                Sort Mode: {selfTimeMode ? 'Self Time' : 'Total Time'}
            </button>
            {selfTimeMode ? (
                <p style={{ fontWeight: 'bold' }}>
                    Methods are sorted according to their "self time" (the time
                    spent executing code within the method)
                </p>
            ) : (
                <p style={{ fontWeight: 'bold' }}>
                    Methods are sorted according to their "total time" (the time
                    spent executing code within the method and the time spent
                    executing sub-calls)
                </p>
            )}
        </div>
    );
};

const SourcesViewHeader = ({ merged, setMerged }) => {
    function onClick() {
        setMerged(!merged);
    }

    return (
        <div className="header">
            <h2>Sources View</h2>
            <p>
                This view shows a filtered representation of the profile broken
                down by plugin/mod (source).
            </p>

            <button onClick={onClick}>
                Merge Mode: {merged ? 'Merge' : 'Separate'}
            </button>
            {merged ? (
                <p style={{ fontWeight: 'bold' }}>
                    Method calls with the same signature will be merged
                    together, even though they may not have been invoked by the
                    same calling method.
                </p>
            ) : (
                <p style={{ fontWeight: 'bold' }}>
                    Method calls that have the same signature, but that haven't
                    been invoked by the same calling method will show
                    separately.
                </p>
            )}
        </div>
    );
};
