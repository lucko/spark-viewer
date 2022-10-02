import { ExportButton, ShowInfoButton } from '../viewer/controls';
import { HeapTitle } from './meta';

export default function Controls({
    data,
    metadataToggle,
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
                metadataToggle={metadataToggle}
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
