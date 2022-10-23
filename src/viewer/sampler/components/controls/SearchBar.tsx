import { ChangeEvent } from 'react';
import { SearchQuery } from '../../hooks/useSearchQuery';

export interface SearchBarProps {
    searchQuery: SearchQuery;
}

export default function SearchBar({ searchQuery }: SearchBarProps) {
    function onQueryChanged(e: ChangeEvent<HTMLInputElement>) {
        searchQuery.setValue(e.target.value.toLowerCase());
    }

    return (
        <input
            className="searchbar"
            type="text"
            value={searchQuery.value}
            onChange={onQueryChanged}
        ></input>
    );
}
