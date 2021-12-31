import React, { useState } from 'react';

import { AllView, SourcesView, VIEW_ALL, VIEW_SOURCES_MERGED } from './views';
import Controls from './controls';
import Flame from './flamegraph';
import { VersionWarning, WidgetsAndMetadata } from '../viewer/meta';
import { useHighlight } from './highlight';
import { useSearchQuery } from './search';

import { Menu, Item, theme } from 'react-contexify';

import 'react-contexify/dist/ReactContexify.css';
import '../style/sampler.scss';

export default function Sampler({ data, mappings, exportCallback }) {
    const searchQuery = useSearchQuery();
    const highlighted = useHighlight();

    const [flameData, setFlameData] = useState(null);
    const [view, setView] = useState(VIEW_ALL);

    const [showMetadataDetail, setShowMetadataDetail] = useState(false);

    // Callback function for the "Toggle bookmark" context menu button
    function handleHighlight({ props }) {
        highlighted.toggle(props.node.id);
    }

    // Callback function for the "View as Flame Graph" context menu button
    function handleFlame({ props }) {
        setFlameData(props.node);
    }

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

            {!data.metadata.platform && <VersionWarning />}

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
                ) : (
                    <SourcesView
                        data={
                            view === VIEW_SOURCES_MERGED
                                ? data.bySource
                                : data.bySourceSeparate
                        }
                        mappings={mappings}
                        view={view}
                        setView={setView}
                        highlighted={highlighted}
                        searchQuery={searchQuery}
                    />
                )}
            </div>

            <Menu id={'sampler-cm'} theme={theme.dark}>
                <Item onClick={handleFlame}>View as Flame Graph</Item>
                <Item onClick={handleHighlight}>Toggle bookmark</Item>
            </Menu>
        </div>
    );
}
