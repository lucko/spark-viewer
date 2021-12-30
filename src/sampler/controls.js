import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes,
    faEye,
    faFileExport,
    faFire,
    faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

import { MetadataTitle } from './meta';
import SearchBar from './search';

import {
    VIEW_ALL,
    VIEW_SOURCES_MERGED,
} from './views';

export default function Controls({
    data,
    showMetadataDetail,
    setShowMetadataDetail,
    exportCallback,
    view,
    setView,
    flameData,
    setFlameData,
    searchQuery,
}) {
    const { metadata } = data;

    return (
        <div className="controls">
            <ShowInfoButton
                metadata={metadata}
                showMetadataDetail={showMetadataDetail}
                setShowMetadataDetail={setShowMetadataDetail}
            />
            <MetadataTitle metadata={metadata} />
            {!flameData ? (
                <>
                    <ToggleViewButton
                        data={data}
                        view={view}
                        setView={setView}
                    />
                    <SearchBar searchQuery={searchQuery} />
                    <FlameButton data={data} setFlameData={setFlameData} />
                    <ExportButton exportCallback={exportCallback} />
                </>
            ) : (
                <ExitFlameButton setFlameData={setFlameData} />
            )}
        </div>
    );
}

const ShowInfoButton = ({
    metadata,
    showMetadataDetail,
    setShowMetadataDetail,
}) => {
    if (!metadata.platform) {
        return null;
    }

    function onClick() {
        setShowMetadataDetail(!showMetadataDetail);
    }

    return (
        <FaButton
            icon={faInfoCircle}
            onClick={onClick}
            title={
                !showMetadataDetail
                    ? 'Click to show more information and statistics about the system'
                    : 'Click to hide extra information'
            }
            style={{ color: showMetadataDetail ? 'white' : undefined }}
        />
    );
};

const ToggleViewButton = ({ data, view, setView }) => {
    if (!Object.keys(data.classSources).length) {
        return null;
    }

    function onClick() {
        if (view === VIEW_ALL) {
            setView(VIEW_SOURCES_MERGED);
        } else {
            setView(VIEW_ALL);
        }
    }

    let label;
    if (view === VIEW_ALL) {
        label = 'all';
    } else {
        label = 'sources';
    }

    return (
        <FaButton
            icon={faEye}
            onClick={onClick}
            title="Toggle the view"
            style={{
                justifyContent: 'space-between',
                padding: '0 12px',
                width: '9em',
            }}
        >
            <span>{label}</span>
        </FaButton>
    );
};

const ExportButton = ({ exportCallback }) => {
    if (!exportCallback) {
        return null;
    }
    return (
        <FaButton
            icon={faFileExport}
            onClick={exportCallback}
            title="Export this profile to a local file"
        />
    );
};

const FlameButton = ({ data, setFlameData }) => {
    if (data.threads.length !== 1) {
        return null;
    }

    function onClick() {
        setFlameData(data.threads[0]);
    }

    return (
        <FaButton
            icon={faFire}
            onClick={onClick}
            title="View the profile as a Flame Graph"
        />
    );
};

const ExitFlameButton = ({ setFlameData }) => {
    function onClick() {
        setFlameData(null);
    }

    return (
        <FaButton
            icon={faTimes}
            onClick={onClick}
            title="Exit the Flame Graph view"
        />
    );
};

const FaButton = ({ icon, onClick, title, style, children }) => {
    return (
        <div
            className="button text-box"
            onClick={onClick}
            title={title}
            style={{
                width: '36px',
                ...style,
            }}
        >
            <FontAwesomeIcon icon={icon} />
            {children}
        </div>
    );
};
