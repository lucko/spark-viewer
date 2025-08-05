import { useCallback, useState } from 'react';
import VirtualNode from '../node/VirtualNode';
import { SearchQuery } from './useSearchQuery';
import { Highlight } from './useHighlight';

export interface Expanded {
    set: (node: VirtualNode, value: boolean | undefined) => void;
    get: (node: VirtualNode) => boolean | undefined;
    getOrDefault: (node: VirtualNode, directParent: VirtualNode | null, bottomUp: boolean) => boolean;
    toggle: (node: VirtualNode) => void;
    clearAll: () => void;
}

export default function useExpanded(searchQuery: SearchQuery, highlighted: Highlight): Expanded {
    const [expanded, setExpanded] = useState<Map<string, boolean>>(() => new Map());

    // Set expanded state for a node
    const set: Expanded['set'] = useCallback(
        (node, value) => {
            setExpanded(prev => {
                const map = new Map(prev);
                if (value === undefined) {
                    map.delete(String(node.getId()));
                } else {
                    map.set(String(node.getId()), value);
                }
                return map;
            });
        },
        []
    );

    // Get expanded state for a node
    const get: Expanded['get'] = useCallback(
        node => {
            return expanded.get(String(node.getId()));
        },
        [expanded]
    );

    // Get expanded state, or default (sometimes, nodes should be expanded by default)
    const getOrDefault: Expanded['getOrDefault'] = (node, directParent, bottomUp) => {
        const value = get(node);
        if (value !== undefined) return value;
        // Inline auto-expand logic here
        if (highlighted.check(node)) return true;
        if (directParent == null) return false;
        let nodes;
        if (bottomUp) nodes = directParent.getParents();
        else nodes = directParent.getChildren();
        nodes = nodes.filter(n => searchQuery.matches(n));
        return nodes.length <= 1;
    };

    // Toggle expanded state for a node
    const toggle: Expanded['toggle'] = useCallback(
        node => {
            set(node, !get(node));
        },
        [set, get]
    );

    // Clear all expanded nodes
    const clearAll: Expanded['clearAll'] = useCallback(
        () => setExpanded(new Map()),
        []
    );

    return { set, get, getOrDefault, toggle, clearAll };
}
