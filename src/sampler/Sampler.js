import React, { useState } from 'react';

import Controls from './controls';
import {
    AllView,
    SourcesView,
    VIEW_ALL,
    VIEW_SOURCES_MERGED,
    VIEW_SOURCES_SEPARATE,
} from './views';
import Flame from './flamegraph';
import { useHighlight } from './highlight';
import { useSearchQuery } from './search';

// context menu
import { Menu, Item, theme } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';

export default function Sampler({ data, mappings, exportCallback }) {
    const { metadata, threads } = data;

    const searchQuery = useSearchQuery();
    const highlighted = useHighlight();

    const [flameData, setFlameData] = useState(null);
    const [view, setView] = useState(VIEW_ALL);

    // Callback function for the "Toggle bookmark" context menu button
    function handleHighlight({ props }) {
        highlighted.toggle(props.node.id);
    }

    // Callback function for the "View as Flame Graph" context menu button
    function handleFlame({ props }) {
        setFlameData(props.node);
    }

    let viewComponent;
    if (view === VIEW_ALL) {
        viewComponent = (
            <AllView
                threads={threads}
                mappings={mappings}
                highlighted={highlighted}
                searchQuery={searchQuery}
            />
        );
    } else if (view === VIEW_SOURCES_MERGED || view === VIEW_SOURCES_SEPARATE) {
        viewComponent = (
            <SourcesView
                classSources={data.classSources}
                threads={threads}
                mappings={mappings}
                highlighted={highlighted}
                searchQuery={searchQuery}
                mergeMode={view === VIEW_SOURCES_MERGED}
            />
        );
    }

    return (
        <div id="sampler">
            <Controls
                metadata={metadata}
                data={data}
                exportCallback={exportCallback}
                view={view}
                setView={setView}
                flameData={flameData}
                setFlameData={setFlameData}
                searchQuery={searchQuery}
            />

            {!!flameData && <Flame flameData={flameData} mappings={mappings} />}

            <div style={!!flameData ? { display: 'none' } : {}}>
                {viewComponent}
            </div>

            <Menu id={'sampler-cm'} theme={theme.dark}>
                <Item onClick={handleFlame}>View as Flame Graph</Item>
                <Item onClick={handleHighlight}>Toggle bookmark</Item>
            </Menu>
        </div>
    );
}
