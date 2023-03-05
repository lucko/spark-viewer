import {
    Dispatch,
    SetStateAction,
    useCallback,
    useMemo,
    useState,
} from 'react';
import SearchResolver from '../data/SearchResolver';
import VirtualNode from '../node/VirtualNode';
import SamplerData from '../SamplerData';

export interface SearchQuery {
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    matches: (node: VirtualNode) => boolean;
}

export default function useSearchQuery(data: SamplerData): SearchQuery {
    const [value, setValue] = useState('');

    const resolvedNodes: Set<number> | null = useMemo(() => {
        return value
            ? new SearchResolver(data).resolveSearchQuery(value)
            : null;
    }, [data, value]);

    const matches: SearchQuery['matches'] = useCallback(
        node => {
            if (resolvedNodes == null) {
                return true;
            }

            const id = node.getId();
            return Array.isArray(id)
                ? id.some(i => resolvedNodes.has(i))
                : resolvedNodes.has(id);
        },
        [resolvedNodes]
    );

    return {
        value,
        setValue,
        matches,
    };
}
