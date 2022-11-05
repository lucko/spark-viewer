import { get as lsGet, remove as lsRemove, set as lsSet } from 'local-storage';
import { useCallback, useEffect, useState } from 'react';
import { SparkContentType } from '../../common/logic/contentType';
import { SamplerData } from '../../proto/spark_pb';
import { fetchMappingsMetadata, MappingsMetadata } from '../mappings/fetch';
import NoOpMappingFunction from '../mappings/functions/noop';
import loadMappings from '../mappings/loader';
import { MappingsResolver } from '../mappings/resolver';

export interface MappingsHook {
    load: (type: SparkContentType) => void;
    requestMappings: (type: string) => void;
    mappingsMetadata?: MappingsMetadata;
    mappingsResolver: MappingsResolver;
    mappingsType: string;
}

export default function useMappings(data?: SamplerData): MappingsHook {
    const [mappingsMetadata, setMappingsMetadata] =
        useState<MappingsMetadata>();
    const [mappingsResolver, setMappingsResolver] = useState<MappingsResolver>(
        new MappingsResolver(NoOpMappingFunction.INSTANCE)
    );
    const [mappingsType, setMappingsType] = useState(
        lsGet('spark-mappings-pref') === 'none' ? 'none' : 'auto'
    );

    // Called when mappings should be initialised
    const load = useCallback(
        (type: SparkContentType) => {
            if (type === 'application/x-spark-sampler') {
                fetchMappingsMetadata().then(setMappingsMetadata);
            }
        },
        [setMappingsMetadata]
    );

    // Function called whenever the user picks mappings, either
    // from the input dropdown, or 'auto' when mappings info is loaded.
    const requestMappings = useCallback(
        (type: string) => {
            if (mappingsMetadata && data && mappingsType !== type) {
                setMappingsType(type);
                loadMappings(type, mappingsMetadata, data).then(func => {
                    setMappingsResolver(new MappingsResolver(func));
                });

                if (type === 'none') {
                    lsSet('spark-mappings-pref', 'none');
                } else {
                    lsRemove('spark-mappings-pref');
                }
            }
        },
        [mappingsType, mappingsMetadata, data]
    );

    // Wait for mappingsInfo and the data ('loaded') to be populated,
    // then run a mappings request for 'auto'.
    useEffect(() => {
        if (mappingsMetadata && data && mappingsType === 'auto') {
            loadMappings('auto', mappingsMetadata, data).then(func => {
                setMappingsResolver(new MappingsResolver(func));
            });
        }
    }, [mappingsType, mappingsMetadata, data]);

    return {
        load,
        requestMappings,
        mappingsMetadata,
        mappingsResolver,
        mappingsType,
    };
}
