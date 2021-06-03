import React, { useState } from 'react';

export function useSearchQuery() {
    const [value, setValue] = useState('');

    const matches = (node, parents) => {
        if (!value) {
            return true;
        }

        if (nodeMatchesQuery(value, node)) {
            return true;
        }
        for (const parent of parents) {
            if (nodeMatchesQuery(value, parent)) {
                return true;
            }
        }
        return searchMatchesChildren(value, node);
    };

    return {
        value,
        setValue,
        matches,
    };
}

export default function SearchBar({ searchQuery }) {
    function onQueryChanged(e) {
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

function nodeMatchesQuery(query, node) {
    if (!node.className || !node.methodName) {
        return node.name.toLowerCase().includes(query);
    } else {
        return (
            node.className.toLowerCase().includes(query) ||
            node.methodName.toLowerCase().includes(query) ||
            (node.source && node.source.toLowerCase().includes(query))
        );
    }
}

function searchMatchesChildren(query, node) {
    if (!node.children) {
        return false;
    }
    for (const child of node.children) {
        if (nodeMatchesQuery(query, child)) {
            return true;
        }
        if (searchMatchesChildren(query, child)) {
            return true;
        }
    }
    return false;
}
