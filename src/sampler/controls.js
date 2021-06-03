import React from 'react';

import Metadata from './metadata';
import SearchBar from './search';

export default function Controls({
    metadata,
    data,
    sourceView,
    setSourceView,
    flameData,
    setFlameData,
    searchQuery,
}) {
    function exitFlame() {
        setFlameData(null);
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
            {!!flameData ? (
                <ExitFlameViewButton callback={exitFlame} />
            ) : (
                <SearchBar searchQuery={searchQuery} />
            )}
        </div>
    );
}

const ToggleViewButton = ({ state, toggle }) => {
    return (
        <div className="metadata-button banner-notice" onClick={toggle}>
            {state ? 'view: sources' : 'view: all'}
        </div>
    );
};

const ExitFlameViewButton = ({ callback }) => {
    return (
        <div className="metadata-button banner-notice" onClick={callback}>
            Exit Flame View
        </div>
    );
};
