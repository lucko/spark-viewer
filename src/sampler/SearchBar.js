import React from 'react';

export function SearchBar({ searchQuery, setSearchQuery }) {
    function onQueryChanged(e) {
        setSearchQuery(e.target.value.toLowerCase());
    }
    return <input className="searchbar" type="text" value={searchQuery} onChange={onQueryChanged}></input>
}

function nodeMatchesQuery(query, node) {
    if (!node.className || !node.methodName) {
        return node.name.toLowerCase().includes(query);
    } else {
        return node.className.toLowerCase().includes(query) || node.methodName.toLowerCase().includes(query);
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

export function searchMatches(query, node, parents) {
    if (nodeMatchesQuery(query, node)) {
        return true;
    }
    for (const parent of parents) {
        if (nodeMatchesQuery(query, parent)) {
            return true;
        }
    }
    return searchMatchesChildren(query, node);
}
