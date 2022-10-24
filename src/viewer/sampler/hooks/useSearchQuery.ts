import { Dispatch, SetStateAction, useState } from 'react';
import { isThreadNode } from '../../proto/guards';
import { StackTraceNodeWithSource } from '../../proto/nodes';
import { StackTraceNode, ThreadNode } from '../../proto/spark_pb';

export interface SearchQuery {
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    matches: (
        node: StackTraceNode | ThreadNode,
        parents: (StackTraceNode | ThreadNode)[]
    ) => boolean;
}

export default function useSearchQuery(): SearchQuery {
    const [value, setValue] = useState('');

    const matches: SearchQuery['matches'] = (node, parents) => {
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

function nodeMatchesQuery(query: string, node: StackTraceNode | ThreadNode) {
    if (isThreadNode(node)) {
        return node.name.toLowerCase().includes(query);
    } else {
        const source = (node as StackTraceNodeWithSource).source;
        return (
            node.className.toLowerCase().includes(query) ||
            node.methodName.toLowerCase().includes(query) ||
            (source && source.toLowerCase().includes(query))
        );
    }
}

function searchMatchesChildren(
    query: string,
    node: StackTraceNode | ThreadNode
) {
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
