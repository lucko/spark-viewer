// Attempts to determine which mappings to apply automatically,
// based on the mappings info resource and the current profile data.
import { SamplerData } from '../../../proto/spark_pb';
import { MappingsMetadata } from './fetch';

export default function detectMappings(
    mappingsInfo: MappingsMetadata,
    profileData: SamplerData
): string | null {
    if (!mappingsInfo.auto || !profileData.metadata) {
        return null;
    }

    const meta = profileData.metadata;
    if (
        meta &&
        meta.platform &&
        meta.platform.name &&
        meta.platform.minecraftVersion
    ) {
        const rc = meta.platform.minecraftVersion.match(
            /(\d+\.\d+) Release Candidate \d+/
        );
        if (rc) {
            meta.platform.minecraftVersion = rc[1];
        }

        const id =
            meta.platform.name.toLowerCase() +
            '/' +
            meta.platform.minecraftVersion;
        return mappingsInfo.auto[id];
    }
    return null;
}
