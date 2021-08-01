import { useState } from 'react';

import history from 'history/browser';

// some functions for sets which accept either 'value' or '[value1, value2]' parameters
const setMultiOp = func => (set, value) => {
    if (Array.isArray(value)) {
        for (const el of value) {
            if (func(set, el)) {
                return true;
            }
        }
    } else {
        return func(set, value);
    }
};
const setHas = setMultiOp((set, v) => set.has(v));
const setAdd = setMultiOp((set, v) => {
    set.add(v);
    return false;
});
const setDelete = setMultiOp((set, v) => {
    set.delete(v);
    return false;
});

export function useHighlight() {
    const [highlighted, setHighlighted] = useState(() => {
        const set = new Set();
        const params = new URLSearchParams(window.location.search);
        const ids = params.get('hl');
        if (ids) {
            ids.split(',').forEach(id => set.add(parseInt(id)));
        }
        return set;
    });

    // Toggles the highlighted state of an id
    const toggle = id => {
        const set = new Set(highlighted);
        if (setHas(set, id)) {
            setDelete(set, id);
        } else {
            setAdd(set, id);
        }
        setHighlighted(set);
        history.replace({
            search: '?hl=' + Array.from(set).join(','),
        });
    };

    // Checks if a node, or one of it's children is in the given highlighted set
    const check = node => {
        if (!highlighted.size) {
            return false;
        }

        if (setHas(highlighted, node.id)) {
            return true;
        }
        for (const c of node.children) {
            if (check(c)) {
                return true;
            }
        }
        return false;
    };

    // Checks whether a node with the given id is in the highlighted set
    const has = id => setHas(highlighted, id);

    return { toggle, check, has };
}
