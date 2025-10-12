import { createContext, ReactNode } from 'react';
import { SamplerMetadata } from '../../proto/spark_pb';
import { Highlight } from '../hooks/useHighlight';
import { InfoPointsHook } from '../hooks/useInfoPoints';
import { SearchQuery } from '../hooks/useSearchQuery';
import { TimeSelector } from '../hooks/useTimeSelector';
import { MappingsResolver } from '../mappings/resolver';

export const MappingsContext = createContext<MappingsResolver | undefined>(
    undefined
);
export const InfoPointsContext = createContext<InfoPointsHook | undefined>(
    undefined
);
export const HighlightedContext = createContext<Highlight | undefined>(
    undefined
);
export const SearchQueryContext = createContext<SearchQuery | undefined>(
    undefined
);
export const MetadataContext = createContext<SamplerMetadata | undefined>(
    undefined
);
export const LabelModeContext = createContext<boolean>(false);
export const TimeSelectorContext = createContext<TimeSelector | undefined>(
    undefined
);

export default function SamplerContext({
    mappings,
    infoPoints,
    highlighted,
    searchQuery,
    labelMode,
    metadata,
    timeSelector,
    children,
}: {
    mappings: MappingsResolver;
    infoPoints: InfoPointsHook;
    highlighted: Highlight;
    searchQuery: SearchQuery;
    labelMode: boolean;
    metadata: SamplerMetadata;
    timeSelector: TimeSelector;
    children: ReactNode;
}) {
    // :]
    return (
        <MappingsContext.Provider value={mappings}>
            <InfoPointsContext.Provider value={infoPoints}>
                <HighlightedContext.Provider value={highlighted}>
                    <SearchQueryContext.Provider value={searchQuery}>
                        <LabelModeContext.Provider value={labelMode}>
                            <MetadataContext.Provider value={metadata}>
                                <TimeSelectorContext.Provider
                                    value={timeSelector}
                                >
                                    {children}
                                </TimeSelectorContext.Provider>
                            </MetadataContext.Provider>
                        </LabelModeContext.Provider>
                    </SearchQueryContext.Provider>
                </HighlightedContext.Provider>
            </InfoPointsContext.Provider>
        </MappingsContext.Provider>
    );
}
