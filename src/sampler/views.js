import React, { createContext, useState } from 'react';

import { BaseNode } from './display';
import { formatTime } from '../misc/util';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import TextBox from '../components/TextBox';

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
    const [bottomUp, setBottomUp] = useState(false);
    const [selfTimeMode, setSelfTimeMode] = useState(false);
    const data = selfTimeMode ? dataSelfTime : dataTotalTime;

    return (
        <div className="flatview">
            <FlatViewHeader
                bottomUp={bottomUp}
                setBottomUp={setBottomUp}
                selfTimeMode={selfTimeMode}
                setSelfTimeMode={setSelfTimeMode}
            />
            <hr />
            {!data ? (
                <TextBox>Loading...</TextBox>
            ) : (
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
            )}
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
            {!data ? (
                <TextBox>Loading...</TextBox>
            ) : (
                data.map(({ source, totalTime, threads }) => (
                    <SourceSection
                        source={source}
                        totalTime={totalTime}
                        threads={threads}
                        mappings={mappings}
                        highlighted={highlighted}
                        searchQuery={searchQuery}
                        key={source}
                    />
                ))
            )}
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
    return (
        <div className="header">
            <h2>Flat View</h2>
            <p>
                This view shows a flattened representation of the profile, where
                the slowest 250 method calls are listed at the top level.
            </p>

            <Button
                value={bottomUp}
                setValue={setBottomUp}
                title="Display"
                labelTrue="Bottom Up"
                labelFalse="Top Down"
            >
                <p>
                    The call tree is reversed - expanding a node reveals the
                    method that called it.
                </p>
                <p>
                    The call tree is "normal" - expanding a node reveals the
                    sub-methods that it calls.
                </p>
            </Button>

            <Button
                value={selfTimeMode}
                setValue={setSelfTimeMode}
                title="Sort Mode"
                labelTrue="Self Time"
                labelFalse="Total Time"
            >
                <p>
                    Methods are sorted according to their "self time" (the time
                    spent executing code within the method)
                </p>
                <p>
                    Methods are sorted according to their "total time" (the time
                    spent executing code within the method and the time spent
                    executing sub-calls)
                </p>
            </Button>
        </div>
    );
};

const SourcesViewHeader = ({ merged, setMerged }) => {
    return (
        <div className="header">
            <h2>Sources View</h2>
            <p>
                This view shows a filtered representation of the profile broken
                down by plugin/mod (source).
            </p>

            <Button
                value={merged}
                setValue={setMerged}
                title="Merge Mode"
                labelTrue="Merge"
                labelFalse="Separate"
            >
                <p>
                    Method calls with the same signature will be merged
                    together, even though they may not have been invoked by the
                    same calling method.
                </p>
                <p>
                    Method calls that have the same signature, but that haven't
                    been invoked by the same calling method will show
                    separately.
                </p>
            </Button>
        </div>
    );
};

const Button = ({
    value,
    setValue,
    title,
    labelTrue,
    labelFalse,
    children,
}) => {
    function onClick() {
        setValue(!value);
    }

    return (
        <div className="button">
            <button onClick={onClick}>
                <FontAwesomeIcon icon={faCogs} /> <span>{title}:</span>{' '}
                {value ? labelTrue : labelFalse}
            </button>
            {value ? children[0] : children[1]}
        </div>
    );
};
