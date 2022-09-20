import React, { createContext, useContext, useState } from 'react';

import { BaseNode } from './display';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import TextBox from '../components/TextBox';
import { LabelModeContext, MetadataContext } from '.';

export const VIEW_ALL = Symbol();
export const VIEW_FLAT = Symbol();
export const VIEW_SOURCES = Symbol();
export const VIEWS = [VIEW_ALL, VIEW_FLAT, VIEW_SOURCES];

export const BottomUpContext = createContext(false);

// The sampler view in which all data is shown in one, single stack.
export function AllView({ threads, setLabelMode }) {
    const labelMode = useContext(LabelModeContext);

    return (
        <div className="allview">
            <AllViewHeader>
                <LabelModeButton
                    labelMode={labelMode}
                    setLabelMode={setLabelMode}
                />
            </AllViewHeader>
            <hr />
            <div className="stack">
                <LabelModeContext.Provider value={labelMode}>
                    {threads.map(thread => (
                        <BaseNode
                            parents={[]}
                            node={thread}
                            key={thread.name}
                        />
                    ))}
                </LabelModeContext.Provider>
            </div>
        </div>
    );
}

// The sampler view in which the stack is flattened to the top x nodes
// according to total time or self time.
export function FlatView({ dataSelfTime, dataTotalTime, setLabelMode }) {
    const labelMode = useContext(LabelModeContext);
    const [bottomUp, setBottomUp] = useState(false);
    const [selfTimeMode, setSelfTimeMode] = useState(false);
    const data = selfTimeMode ? dataSelfTime : dataTotalTime;

    return (
        <div className="flatview">
            <FlatViewHeader>
                <LabelModeButton
                    labelMode={labelMode}
                    setLabelMode={setLabelMode}
                />
                <BottomUpButton bottomUp={bottomUp} setBottomUp={setBottomUp} />
                <SelfTimeModeButton
                    selfTimeMode={selfTimeMode}
                    setSelfTimeMode={setSelfTimeMode}
                />
            </FlatViewHeader>
            <hr />
            {!data ? (
                <TextBox>Loading...</TextBox>
            ) : (
                <div className="stack">
                    <LabelModeContext.Provider value={labelMode}>
                        <BottomUpContext.Provider value={bottomUp}>
                            {data.map(thread => (
                                <BaseNode
                                    parents={[]}
                                    node={thread}
                                    key={thread.name}
                                />
                            ))}
                        </BottomUpContext.Provider>
                    </LabelModeContext.Provider>
                </div>
            )}
        </div>
    );
}

// The sampler view in which there is a stack displayed for each known source.
export function SourcesView({ dataMerged, dataSeparate, setLabelMode }) {
    const labelMode = useContext(LabelModeContext);
    const [merged, setMerged] = useState(true);
    const data = merged ? dataMerged : dataSeparate;

    return (
        <div className="sourceview">
            <SourcesViewHeader>
                <LabelModeButton
                    labelMode={labelMode}
                    setLabelMode={setLabelMode}
                />
                <MergeModeButton merged={merged} setMerged={setMerged} />
            </SourcesViewHeader>
            <hr />
            <LabelModeContext.Provider value={labelMode}>
                {!data ? (
                    <TextBox>Loading...</TextBox>
                ) : (
                    <>
                        {data.map(({ source, totalTime, threads }) => (
                            <SourceSection
                                source={source}
                                totalTime={totalTime}
                                threads={threads}
                                key={source}
                            />
                        ))}
                        <OtherSourcesSection data={data} />
                    </>
                )}
            </LabelModeContext.Provider>
        </div>
    );
}

const formatVersion = version => {
    return version.startsWith('v') ? version : 'v' + version;
};

const SourceSection = ({ source, totalTime, threads }) => {
    const metadata = useContext(MetadataContext);
    const sourceInfo = metadata.sources[source.toLowerCase()];

    return (
        <div className="stack">
            <h2>
                {source}{' '}
                {sourceInfo && (
                    <span className="version">({formatVersion(sourceInfo.version)})</span>
                )}
            </h2>
            {threads.map(thread => (
                <BaseNode
                    parents={[]}
                    node={thread}
                    isSourceRoot={true}
                    key={thread.name}
                />
            ))}
        </div>
    );
};

const OtherSourcesSection = ({ data }) => {
    const metadata = useContext(MetadataContext);
    if (!metadata.sources) {
        return null;
    }

    const alreadyShown = data.map(s => s.source);
    const otherSources = Object.values(metadata.sources).filter(
        source => !alreadyShown.includes(source.name)
    );

    if (!otherSources.length) {
        return null;
    }

    const sourceNoun = ['Fabric', 'Forge'].includes(metadata?.platform?.name)
        ? 'mods'
        : 'plugins';

    return (
        <div className="other-sources">
            <h2>Other</h2>
            <p>
                The following other {sourceNoun} are installed, but didn't show
                up in this profile. Yay!
            </p>
            <ul>
                {otherSources.map(({ name, version }) => (
                    <li key={name}>
                        {name} <span>({formatVersion(version)})</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const AllViewHeader = ({ children }) => {
    return (
        <div className="header">
            <h2>All View</h2>
            <p>
                This is the default profiler view. It shows the entire profile
                as an expandable tree.
            </p>
            {children}
        </div>
    );
};

const LabelModeButton = ({ labelMode, setLabelMode }) => {
    const metadata = useContext(MetadataContext);
    if (!metadata.numberOfTicks) {
        return null;
    }

    return (
        <Button
            value={labelMode}
            setValue={setLabelMode}
            title="Label"
            labelTrue="Time per tick"
            labelFalse="Percentage"
        >
            <p>
                The value displayed against each frame is the average time in
                milliseconds spent executing the method each tick.
            </p>
            <p>
                The value displayed against each frame is the time divided by
                the total time as a percentage.
            </p>
        </Button>
    );
};

const FlatViewHeader = ({ children }) => {
    return (
        <div className="header">
            <h2>Flat View</h2>
            <p>
                This view shows a flattened representation of the profile, where
                the slowest 250 method calls are listed at the top level.
            </p>
            {children}
        </div>
    );
};

const BottomUpButton = ({ bottomUp, setBottomUp }) => {
    return (
        <Button
            value={bottomUp}
            setValue={setBottomUp}
            title="Display"
            labelTrue="Bottom Up"
            labelFalse="Top Down"
        >
            <p>
                The call tree is reversed - expanding a node reveals the method
                that called it.
            </p>
            <p>
                The call tree is "normal" - expanding a node reveals the
                sub-methods that it calls.
            </p>
        </Button>
    );
};

const SelfTimeModeButton = ({ selfTimeMode, setSelfTimeMode }) => {
    return (
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
    );
};

const SourcesViewHeader = ({ children }) => {
    const metadata = useContext(MetadataContext);
    const sourceNoun = ['Fabric', 'Forge'].includes(metadata?.platform?.name)
        ? { singular: 'mod', plural: 'Mods' }
        : { singular: 'plugin', plural: 'Plugins' };

    return (
        <div className="header">
            <h2>{sourceNoun.plural} View</h2>
            <p>
                This view shows a filtered representation of the profile broken
                down by {sourceNoun.singular}.
            </p>
            {children}
        </div>
    );
};

const MergeModeButton = ({ merged, setMerged }) => {
    return (
        <Button
            value={merged}
            setValue={setMerged}
            title="Merge Mode"
            labelTrue="Merge"
            labelFalse="Separate"
        >
            <p>
                Method calls with the same signature will be merged together,
                even though they may not have been invoked by the same calling
                method.
            </p>
            <p>
                Method calls that have the same signature, but that haven't been
                invoked by the same calling method will show separately.
            </p>
        </Button>
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
