import { get as lsGet, remove as lsRemove, set as lsSet } from 'local-storage';
import { useCallback, useEffect, useState } from 'react';
import { SamplerMetadata } from '../../proto/spark_pb';
import { fetchMappingsMetadata, MappingsMetadata } from '../mappings/fetch';
import NoOpMappingFunction from '../mappings/functions/noop';
import loadMappings from '../mappings/loader';
import { MappingsResolver } from '../mappings/resolver';

export interface MappingsHook {
    requestMappings: (type: string) => void;
    mappingsMetadata?: MappingsMetadata;
    mappingsResolver: MappingsResolver;
    mappingsType: string;
}

export default function useMappings(metadata: SamplerMetadata): MappingsHook {
    const [mappingsMetadata, setMappingsMetadata] =
        useState<MappingsMetadata>();
    const [mappingsResolver, setMappingsResolver] = useState<MappingsResolver>(
        new MappingsResolver(NoOpMappingFunction.INSTANCE)
    );
    const [mappingsType, setMappingsType] = useState(
        lsGet('spark-mappings-pref') === 'none' ? 'none' : 'auto'
    );

    useEffect(() => {
        fetchMappingsMetadata().then(setMappingsMetadata);
    }, []);

    // Function called whenever the user picks mappings, either
    // from the input dropdown, or 'auto' when mappings info is loaded.
    const requestMappings = useCallback(
        (type: string) => {
            if (mappingsMetadata && metadata && mappingsType !== type) {
                setMappingsType(type);
                loadMappings(type, mappingsMetadata, metadata).then(func => {
                    setMappingsResolver(new MappingsResolver(func));
                });

                if (type === 'none') {
                    lsSet('spark-mappings-pref', 'none');
                } else {
                    lsRemove('spark-mappings-pref');
                }
            }
        },
        [mappingsType, mappingsMetadata, metadata]
    );

    // Wait for mappingsInfo and the data ('loaded') to be populated,
    // then run a mappings request for 'auto'.
    useEffect(() => {
        if (mappingsMetadata && metadata && mappingsType === 'auto') {
            loadMappings('auto', mappingsMetadata, metadata).then(func => {
                setMappingsResolver(new MappingsResolver(func));
            });
        }
    }, [mappingsType, mappingsMetadata, metadata]);

    return {
        requestMappings,
        mappingsMetadata,
        mappingsResolver,
        mappingsType,
    };
}
