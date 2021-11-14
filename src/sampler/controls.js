import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes,
    faEye,
    faFileExport,
} from '@fortawesome/free-solid-svg-icons';

import Metadata from './meta';
import SearchBar from './search';

import {
    VIEWS,
    VIEW_ALL,
    VIEW_SOURCES_MERGED,
    VIEW_SOURCES_SEPARATE,
} from './views';

export default function Controls({
    metadata,
    data,
    exportCallback,
    view,
    setView,
    flameData,
    setFlameData,
    searchQuery,
}) {
    if (flameData) {
        return (
            <FlameControls metadata={metadata} setFlameData={setFlameData} />
        );
    }

    const sourceViewSupported = !!Object.keys(data.classSources).length;

    return (
        <div id="controls">
            {!!metadata && <Metadata metadata={metadata} />}

            {sourceViewSupported && (
                <ToggleViewButton view={view} setView={setView} />
            )}

            <SearchBar searchQuery={searchQuery} />

            {exportCallback && <ExportButton callback={exportCallback} />}
        </div>
    );
}

const FlameControls = ({ metadata, setFlameData }) => {
    function exitFlame() {
        setFlameData(null);
    }

    return (
        <div id="controls">
            {!!metadata && <Metadata metadata={metadata} />}
            <FaButton icon={faTimes} callback={exitFlame} />
        </div>
    );
};

const ToggleViewButton = ({ view, setView }) => {
    function toggleSourceView() {
        setView(VIEWS[(VIEWS.indexOf(view) + 1) % VIEWS.length]);
    }

    let label;
    if (view === VIEW_ALL) {
        label = 'all';
    } else if (view === VIEW_SOURCES_MERGED) {
        label = 'sources';
    } else if (view === VIEW_SOURCES_SEPARATE) {
        label = '*sources';
    }

    return (
        <div
            className="metadata-button banner-notice"
            onClick={toggleSourceView}
            style={{
                justifyContent: 'space-between',
                padding: '0 12px',
                width: '9em',
            }}
        >
            <FontAwesomeIcon icon={faEye} />
            <span>{label}</span>
        </div>
    );
};

const ExportButton = ({ callback }) => {
    return <FaButton icon={faFileExport} callback={callback} />;
};

const FaButton = ({ callback, icon }) => {
    return (
        <div
            className="metadata-button banner-notice"
            onClick={callback}
            style={{
                width: '36px',
            }}
        >
            <FontAwesomeIcon icon={icon} />
        </div>
    );
};
