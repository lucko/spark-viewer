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
        function exitFlame() {
            setFlameData(null);
        }

        return (
            <div id="controls">
                {!!metadata && <Metadata metadata={metadata} />}
                <FaButton icon={faTimes} callback={exitFlame} />
            </div>
        );
    }

    function toggleSourceView() {
        setView(VIEWS[(VIEWS.indexOf(view) + 1) % VIEWS.length]);
    }

    const sourceViewSupported = !!Object.keys(data.classSources).length;

    return (
        <div id="controls">
            {!!metadata && <Metadata metadata={metadata} />}

            {sourceViewSupported && (
                <ToggleViewButton state={view} toggle={toggleSourceView} />
            )}
            <SearchBar searchQuery={searchQuery} />
            {exportCallback && (
                <FaButton icon={faFileExport} callback={exportCallback} />
            )}
        </div>
    );
}

const ToggleViewButton = ({ state, toggle }) => {
    let label;
    if (state === VIEW_ALL) {
        label = 'all';
    } else if (state === VIEW_SOURCES_MERGED) {
        label = 'sources';
    } else if (state === VIEW_SOURCES_SEPARATE) {
        label = '*sources';
    }

    return (
        <div
            className="metadata-button banner-notice"
            onClick={toggle}
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
