import { env } from '../../../env';

export type MappingsInfoType =
    | 'bukkit-mojang'
    | 'bukkit'
    | 'mcp'
    | 'yarn'
    | 'vanilla';

export interface MappingsMetadata {
    auto: Record<string, string>;
    types: {
        [key in MappingsInfoType]: {
            name: string;
            format: string;
            versions: {
                [key: string]: {
                    name: string;
                    mojangClassNamesAtRuntime?: boolean;
                    nmsVersion?: string;
                };
            };
        };
    };
}

const MAPPING_DATA_URL = `${env.NEXT_PUBLIC_SPARK_MAPPINGS_URL}/dist/`;

/**
 * Gets metadata about the mappings that are available.
 */
export async function fetchMappingsMetadata(): Promise<MappingsMetadata> {
    const resp = await fetch(MAPPING_DATA_URL + 'mappings.json');
    return await resp.json();
}

/**
 * Gets the given type/version of mappings data.
 *
 * @param version the game version
 * @param type the mappings type
 * @param decode the function to apply to decode/parse the mappings data
 */
export async function fetchMappings<T>(
    version: string,
    type: string,
    decode: (arr: Uint8Array) => T
) {
    const resp = await fetch(MAPPING_DATA_URL + version + '/' + type + '.wasm');
    const buf = await resp.arrayBuffer();
    return decode(new Uint8Array(buf));
}
