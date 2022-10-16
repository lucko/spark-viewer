import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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
    const router = useRouter();
    const [highlighted, setHighlighted] = useState(() => {
        const set = new Set();
        const ids = router.query['hl'];
        if (ids) {
            ids.split(',').forEach(id => set.add(parseInt(id)));
        }
        return set;
    });

    useEffect(() => {
        const ids = Array.from(highlighted).join(',');
        if (ids === router.query.hl) {
            return;
        }

        // get the current path without the query parameters
        let path = router.asPath;
        const questionMark = path.indexOf('?');
        if (questionMark >= 0) {
            path = path.substring(0, questionMark);
        }

        const hlParam = highlighted.size ? `?hl=${ids}` : '';
        router.push(path + hlParam, undefined, { shallow: true });
    }, [highlighted]);

    // Toggles the highlighted state of an id
    const toggle = id => {
        const set = new Set(highlighted);
        if (setHas(set, id)) {
            setDelete(set, id);
        } else {
            setAdd(set, id);
        }
        setHighlighted(set);
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

    // Clears all current highlights
    const clear = () => setHighlighted(new Set());

    return { toggle, check, has, clear };
}
