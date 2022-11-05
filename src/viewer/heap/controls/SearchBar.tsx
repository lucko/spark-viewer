import { ChangeEvent, Dispatch, SetStateAction } from 'react';

export interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: Dispatch<SetStateAction<string>>;
}

export default function SearchBar({
    searchQuery,
    setSearchQuery,
}: SearchBarProps) {
    function onQueryChanged(e: ChangeEvent<HTMLInputElement>) {
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
