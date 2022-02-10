import React, { useEffect, useState } from 'react';

import { AllView, FlatView, SourcesView, VIEW_ALL, VIEW_FLAT, VIEW_SOURCES } from './views';
import Controls from './controls';
import Flame from './flamegraph';
import { WidgetsAndMetadata } from '../viewer/meta';
import { useMetadataDetailState } from '../viewer/controls';
import VersionWarning from '../components/VersionWarning';
import { useHighlight } from './highlight';
import { useSearchQuery } from './search';
import { createWorker } from './preprocessing';

import { Menu, Item, theme } from 'react-contexify';

import 'react-contexify/dist/ReactContexify.css';
import '../style/sampler.scss';

export default function Sampler({ data, mappings, exportCallback }) {
    const searchQuery = useSearchQuery();
    const highlighted = useHighlight();

    const cachedView = localStorage.view;

    const [flameData, setFlameData] = useState(null);
    const [view, setView] = useState((cachedView === 'VIEW_FLAT' ? VIEW_FLAT : cachedView === 'VIEW_SOURCES' ? VIEW_SOURCES : VIEW_ALL));

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

    const [showMetadataDetail, setShowMetadataDetail] =
        useMetadataDetailState();

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
                showMetadataDetail={showMetadataDetail}
                setShowMetadataDetail={setShowMetadataDetail}
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
                showMetadataDetail={showMetadataDetail}
            />

            {!!flameData && <Flame flameData={flameData} mappings={mappings} />}

            <div style={{ display: flameData ? 'none' : null }}>
                {view === VIEW_ALL ? (
                    <AllView
                        threads={data.threads}
                        mappings={mappings}
                        highlighted={highlighted}
                        searchQuery={searchQuery}
                    />
                ) : view === VIEW_FLAT ? (
                    <FlatView
                        dataSelfTime={flatViewData.flatSelfTime}
                        dataTotalTime={flatViewData.flatTotalTime}
                        mappings={mappings}
                        highlighted={highlighted}
                        searchQuery={searchQuery}
                    />
                ) : (
                    <SourcesView
                        dataMerged={sourcesViewData.sourcesMerged}
                        dataSeparate={sourcesViewData.sourcesSeparate}
                        mappings={mappings}
                        highlighted={highlighted}
                        searchQuery={searchQuery}
                    />
                )}
            </div>

            <Menu id={'sampler-cm'} theme={theme.dark}>
                <Item onClick={handleFlame}>View as Flame Graph</Item>
                <Item onClick={handleHighlight}>Toggle bookmark</Item>
                <Item onClick={handleHighlightClear}>Clear all bookmarks</Item>
            </Menu>
        </div>
    );
}
