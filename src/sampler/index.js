import dynamic from 'next/dynamic';
import { createContext, Suspense, useEffect, useState } from 'react';

import VersionWarning from '../components/VersionWarning';
import { useMetadataToggle, useToggle } from '../viewer/controls';
import { WidgetsAndMetadata } from '../viewer/meta';
import Controls from './controls';
import Flame from './flamegraph';
import { useHighlight } from './highlight';
import { createWorker } from './preprocessing';
import { useSearchQuery } from './search';
import { useTimeSelector } from './time';
import { AllView, FlatView, SourcesView, VIEW_ALL, VIEW_FLAT } from './views';

import { Item, Menu, theme } from 'react-contexify';

import 'react-contexify/dist/ReactContexify.css';
import styles from '../style/sampler.module.scss';

const Graph = dynamic(() => import('./graph'));

export const MappingsContext = createContext();
export const HighlightedContext = createContext();
export const SearchQueryContext = createContext();
export const MetadataContext = createContext();
export const LabelModeContext = createContext();
export const TimeSelectorContext = createContext();

export default function Sampler({ data, mappings, exportCallback }) {
    const searchQuery = useSearchQuery();
    const highlighted = useHighlight();
    const [labelMode, setLabelMode] = useState(false);
    const timeSelector = useTimeSelector(
        data.timeWindows,
        data.timeWindowStatistics
    );

    const [flameData, setFlameData] = useState(null);
    const [view, setView] = useState(VIEW_ALL);
    const [showGraph, setShowGraph] = useToggle('prefShowGraph', true);

    const [flatViewData, setFlatViewData] = useState({
        flatSelfTime: null,
        flatTotalTime: null,
    });
    const [sourcesViewData, setSourcesViewData] = useState({
        sourcesMerged: null,
        sourcesSeparate: null,
    });

    // Generate flat & sources view in the background on first load
    useEffect(() => {
        createWorker(worker => {
            worker.generateFlatView(data).then(res => {
                setFlatViewData(res);
            });
        });
        createWorker(worker => {
            worker.generateSourceViews(data).then(res => {
                setSourcesViewData(res);
            });
        });
    }, [data]);

    const metadataToggle = useMetadataToggle();

    // Callback function for the "Toggle bookmark" context menu button
    function handleHighlight({ props }) {
        highlighted.toggle(props.node.id);
    }

    // Callback function for the "Clear all bookmarks" context menu button
    function handleHighlightClear() {
        highlighted.clear();
    }

    // Callback function for the "View as Flame Graph" context menu button
    function handleFlame({ props }) {
        setFlameData(props.node);
    }

    const supported =
        data.metadata?.platform?.sparkVersion &&
        data.metadata.platform.sparkVersion >= 2;

    return (
        <div className={styles.sampler}>
            <Controls
                data={data}
                metadataToggle={metadataToggle}
                exportCallback={exportCallback}
                view={view}
                setView={setView}
                graphSupported={timeSelector.supported}
                showGraph={showGraph}
                setShowGraph={setShowGraph}
                flameData={flameData}
                setFlameData={setFlameData}
                searchQuery={searchQuery}
            />

            {!supported && <VersionWarning />}

            <WidgetsAndMetadata
                metadata={data.metadata}
                metadataToggle={metadataToggle}
            />

            {timeSelector.supported && (
                <Suspense>
                    <Graph
                        show={showGraph}
                        timeSelector={timeSelector}
                        windowStatistics={data.timeWindowStatistics}
                    />
                </Suspense>
            )}

            {!!flameData && (
                <Flame
                    flameData={flameData}
                    mappings={mappings}
                    timeSelector={timeSelector}
                />
            )}

            <div style={{ display: flameData ? 'none' : null }}>
                <SamplerContext
                    mappings={mappings}
                    highlighted={highlighted}
                    searchQuery={searchQuery}
                    labelMode={labelMode}
                    metadata={data.metadata}
                    timeSelector={timeSelector}
                >
                    {view === VIEW_ALL ? (
                        <AllView
                            threads={data.threads}
                            setLabelMode={setLabelMode}
                        />
                    ) : view === VIEW_FLAT ? (
                        <FlatView
                            dataSelfTime={flatViewData.flatSelfTime}
                            dataTotalTime={flatViewData.flatTotalTime}
                            setLabelMode={setLabelMode}
                        />
                    ) : (
                        <SourcesView
                            dataMerged={sourcesViewData.sourcesMerged}
                            dataSeparate={sourcesViewData.sourcesSeparate}
                            setLabelMode={setLabelMode}
                        />
                    )}
                </SamplerContext>
            </div>

            <Menu id={'sampler-cm'} theme={theme.dark}>
                <Item onClick={handleFlame}>View as Flame Graph</Item>
                <Item onClick={handleHighlight}>Toggle bookmark</Item>
                <Item onClick={handleHighlightClear}>Clear all bookmarks</Item>
            </Menu>
        </div>
    );
}

const SamplerContext = ({
    mappings,
    highlighted,
    searchQuery,
    labelMode,
    metadata,
    timeSelector,
    children,
}) => {
    // :]
    return (
        <MappingsContext.Provider value={mappings}>
            <HighlightedContext.Provider value={highlighted}>
                <SearchQueryContext.Provider value={searchQuery}>
                    <LabelModeContext.Provider value={labelMode}>
                        <MetadataContext.Provider value={metadata}>
                            <TimeSelectorContext.Provider value={timeSelector}>
                                {children}
                            </TimeSelectorContext.Provider>
                        </MetadataContext.Provider>
                    </LabelModeContext.Provider>
                </SearchQueryContext.Provider>
            </HighlightedContext.Provider>
        </MappingsContext.Provider>
    );
};
