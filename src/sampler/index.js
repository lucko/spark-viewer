import React, { useEffect, useState, createContext } from 'react';

import { AllView, FlatView, SourcesView, VIEW_ALL, VIEW_FLAT } from './views';
import Controls from './controls';
import Flame from './flamegraph';
import { WidgetsAndMetadata } from '../viewer/meta';
import { useMetadataToggle } from '../viewer/controls';
import VersionWarning from '../components/VersionWarning';
import { useHighlight } from './highlight';
import { useSearchQuery } from './search';
import { createWorker } from './preprocessing';

import { Menu, Item, theme } from 'react-contexify';

import 'react-contexify/dist/ReactContexify.css';
import '../style/sampler.scss';

export const MappingsContext = createContext();
export const HighlightedContext = createContext();
export const SearchQueryContext = createContext();
export const MetadataContext = createContext();
export const LabelModeContext = createContext();

export default function Sampler({ data, mappings, exportCallback }) {
    const searchQuery = useSearchQuery();
    const highlighted = useHighlight();
    const [labelMode, setLabelMode] = useState(false);

    const [flameData, setFlameData] = useState(null);
    const [view, setView] = useState(VIEW_ALL);

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
        const worker = createWorker();
        worker.generateFlatView(data).then(res => {
            setFlatViewData(res);
        });
        worker.generateSourceViews(data).then(res => {
            setSourcesViewData(res);
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
        <div className="sampler">
            <Controls
                data={data}
                metadataToggle={metadataToggle}
                exportCallback={exportCallback}
                view={view}
                setView={setView}
                flameData={flameData}
                setFlameData={setFlameData}
                searchQuery={searchQuery}
            />

            {!supported && <VersionWarning />}

            <WidgetsAndMetadata
                metadata={data.metadata}
                metadataToggle={metadataToggle}
            />

            {!!flameData && <Flame flameData={flameData} mappings={mappings} />}

            <div style={{ display: flameData ? 'none' : null }}>
                <SamplerContext
                    mappings={mappings}
                    highlighted={highlighted}
                    searchQuery={searchQuery}
                    labelMode={labelMode}
                    metadata={data.metadata}
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
    children,
}) => {
    // :]
    return (
        <MappingsContext.Provider value={mappings}>
            <HighlightedContext.Provider value={highlighted}>
                <SearchQueryContext.Provider value={searchQuery}>
                    <LabelModeContext.Provider value={labelMode}>
                        <MetadataContext.Provider value={metadata}>
                            {children}
                        </MetadataContext.Provider>
                    </LabelModeContext.Provider>
                </SearchQueryContext.Provider>
            </HighlightedContext.Provider>
        </MappingsContext.Provider>
    );
};
