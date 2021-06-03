import { useState } from 'react';

import history from 'history/browser';

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
        if (set.has(id)) {
            set.delete(id);
        } else {
            set.add(id);
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

        if (highlighted.has(node.id)) {
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
    const has = id => highlighted.has(id);

    return { toggle, check, has };
}
