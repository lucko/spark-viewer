import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import VirtualNode from '../node/VirtualNode';

export interface Highlight {
    toggle: (node: VirtualNode) => void;
    check: (node: VirtualNode) => boolean;
    has: (node: VirtualNode) => boolean;
    clear: () => void;
}

export default function useHighlight(): Highlight {
    const router = useRouter();
    const [highlighted, setHighlighted] = useState(() => {
        const set = new Set<number>();
        const ids = router.query['hl'] as string;
        if (ids) {
            ids.split(',').forEach(id => set.add(parseInt(id)));
        }
        return set;
    });

    useEffect(() => {
        const ids = Array.from(highlighted).join(',');
        if ((!ids && !router.query.hl) || ids === router.query.hl) {
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
    }, [highlighted, router]);

    // Toggles the highlighted state of an id
    const toggle: Highlight['toggle'] = useCallback(
        node => {
            setHighlighted(prev => {
                const set = new Set(prev);
                if (setHas(set, node.getId())) {
                    setDelete(set, node.getId());
                } else {
                    setAdd(set, node.getId());
                }
                return set;
            });
        },
        [setHighlighted]
    );

    // Checks if a node, or one of its children is in the given highlighted set
    const check: Highlight['check'] = useCallback(
        node => {
            if (!highlighted.size) {
                return false;
            }

            if (setHas(highlighted, node.getId())) {
                return true;
            }
            for (const c of node.getChildren()) {
                if (check(c)) {
                    return true;
                }
            }
            return false;
        },
        [highlighted]
    );

    // Checks whether a node with the given id is in the highlighted set
    const has: Highlight['has'] = useCallback(
        node => setHas(highlighted, node.getId()),
        [highlighted]
    );

    // Clears all current highlights
    const clear: Highlight['clear'] = useCallback(
        () => setHighlighted(new Set()),
        [setHighlighted]
    );

    return { toggle, check, has, clear };
}

// some functions for sets which accept either 'value' or '[value1, value2]' parameters
const setMultiOp =
    (func: (set: Set<number>, value: number) => boolean) =>
    (set: Set<number>, value: number | number[]): boolean => {
        if (Array.isArray(value)) {
            for (const el of value) {
                if (func(set, el)) {
                    return true;
                }
            }
            return false;
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
