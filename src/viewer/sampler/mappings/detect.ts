// Attempts to determine which mappings to apply automatically,
// based on the mappings info resource and the current profile data.
import { SamplerMetadata } from '../../proto/spark_pb';
import { MappingsMetadata } from './fetch';

export default function detectMappings(
    mappingsInfo: MappingsMetadata,
    metadata: SamplerMetadata
): string | null {
    if (!mappingsInfo.auto || !metadata) {
        return null;
    }

    if (
        metadata &&
        metadata.platform &&
        metadata.platform.name &&
        metadata.platform.minecraftVersion
    ) {
        const rc = metadata.platform.minecraftVersion.match(
            /(\d+\.\d+) Release Candidate \d+/
        );
        if (rc) {
            metadata.platform.minecraftVersion = rc[1];
        }

        let platformName = metadata.platform.name.toLowerCase();
        if (platformName === 'paper') {
            platformName = 'bukkit';
        }

        const id = platformName + '/' + metadata.platform.minecraftVersion;
        return mappingsInfo.auto[id];
    }
    return null;
}
