import React, { useState } from 'react';

import '../style/sampler.scss';

import classNames from 'classnames';

import Controls from './controls';
import { AllView, SourcesView, VIEW_ALL, VIEW_SOURCES_MERGED } from './views';
import Flame from './flamegraph';
import { MetadataDetail, VersionWarning } from './meta';
import Widgets from './widgets';

import { useHighlight } from './highlight';
import { useSearchQuery } from './search';

// context menu
import { Menu, Item, theme } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';

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

            <div
                className={classNames({
                    metadata: true,
                    expanded: showMetadataDetail,
                })}
            >
                {!!data.metadata.platformStatistics && (
                    <Widgets
                        metadata={data.metadata}
                        expanded={showMetadataDetail}
                    />
                )}

                {!!data.metadata.platform && showMetadataDetail && (
                    <MetadataDetail metadata={data.metadata} />
                )}
            </div>

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
