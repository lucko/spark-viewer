import React from 'react';

import { ExportButton, ShowInfoButton } from '../viewer/controls';
import { HeapTitle } from './meta';

export default function Controls({
    data,
    showMetadataDetail,
    setShowMetadataDetail,
    searchQuery,
    setSearchQuery,
    exportCallback,
}) {
    const { metadata } = data;

    return (
        <div className="controls">
            <HeapTitle metadata={metadata} />
            <ShowInfoButton
                metadata={metadata}
                showMetadataDetail={showMetadataDetail}
                setShowMetadataDetail={setShowMetadataDetail}
            />
            <ExportButton exportCallback={exportCallback} />
            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
        </div>
    );
}

function SearchBar({ searchQuery, setSearchQuery }) {
    function onQueryChanged(e) {
        setSearchQuery(e.target.value.toLowerCase());
    }
    return (
        <input
            className="searchbar"
            type="text"
            value={searchQuery}
            onChange={onQueryChanged}
        ></input>
    );
}
