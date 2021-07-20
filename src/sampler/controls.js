import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes,
    faEye,
    faFileExport,
} from '@fortawesome/free-solid-svg-icons';

import Metadata from './meta';
import SearchBar from './search';

export default function Controls({
    metadata,
    data,
    exportCallback,
    sourceView,
    setSourceView,
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
        setSourceView(!sourceView);
    }

    const sourceViewSupported = !!Object.keys(data.classSources).length;

    return (
        <div id="controls">
            {!!metadata && <Metadata metadata={metadata} />}

            {sourceViewSupported && (
                <ToggleViewButton
                    state={sourceView}
                    toggle={toggleSourceView}
                />
            )}
            <SearchBar searchQuery={searchQuery} />
            {exportCallback && (
                <FaButton icon={faFileExport} callback={exportCallback} />
            )}
        </div>
    );
}

const ToggleViewButton = ({ state, toggle }) => {
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
            <span>{state ? 'sources' : 'all'}</span>
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
