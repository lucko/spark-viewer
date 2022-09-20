import React from 'react';

import { faTimes, faEye, faFire } from '@fortawesome/free-solid-svg-icons';

import FaButton from '../components/FaButton';
import { ExportButton, ShowInfoButton } from '../viewer/controls';
import { ProfileTitle } from './meta';
import SearchBar from './search';

import { VIEW_ALL, VIEW_FLAT, VIEW_SOURCES } from './views';

export default function Controls({
    data,
    metadataToggle,
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
            <ProfileTitle metadata={metadata} />
            <ShowInfoButton
                metadata={metadata}
                metadataToggle={metadataToggle}
            />
            {!flameData ? (
                <>
                    <ToggleViewButton
                        data={data}
                        view={view}
                        setView={setView}
                    />
                    <FlameButton data={data} setFlameData={setFlameData} />
                    <ExportButton exportCallback={exportCallback} />
                    <SearchBar searchQuery={searchQuery} />
                </>
            ) : (
                <ExitFlameButton setFlameData={setFlameData} />
            )}
        </div>
    );
}

const ToggleViewButton = ({ data, view, setView }) => {
    const sourcesViewSupported =
        Object.keys(data.classSources).length ||
        Object.keys(data.methodSources).length ||
        Object.keys(data.lineSources).length;

    const supportedViews = [
        VIEW_ALL,
        VIEW_FLAT,
        ...(sourcesViewSupported ? [VIEW_SOURCES] : []),
    ];

    return supportedViews.map(v => {
        function onClick() {
            setView(v);
        }

        let label;
        if (v === VIEW_ALL) {
            label = 'all';
        } else if (v === VIEW_FLAT) {
            label = 'flat';
        } else {
            const noun = ['Fabric', 'Forge'].includes(
                data?.metadata?.platform?.name
            )
                ? 'mods'
                : 'plugins';

            label = noun;
        }

        return (
            <FaButton
                key={label}
                icon={faEye}
                onClick={onClick}
                title="Toggle the view"
                extraClassName={
                    view === v
                        ? 'sources-view-button toggled'
                        : 'sources-view-button'
                }
            >
                <span>{label}</span>
            </FaButton>
        );
    });
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
