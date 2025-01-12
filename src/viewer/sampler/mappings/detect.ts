import { PlatformMetadata_Type, SamplerMetadata } from '../../proto/spark_pb';
import { MappingsMetadata } from './fetch';

/**
 * Attempts to determine which mappings to apply automatically based on the mappings info resource and the current profile data.
 * @param mappingsInfo
 * @param metadata
 */
export default function detectMappings(
    mappingsInfo: MappingsMetadata,
    metadata: SamplerMetadata
): string | null {
    // ensure we have all the necessary data
    if (
        !mappingsInfo.auto ||
        !metadata ||
        !metadata.platform ||
        !metadata.platform.name ||
        !metadata.platform.minecraftVersion
    ) {
        return null;
    }

    // if the platform is a proxy, it has no mappings
    if (metadata.platform.type === PlatformMetadata_Type.PROXY) {
        return null;
    }

    const rc = metadata.platform.minecraftVersion.match(
        /(\d+\.\d+) Release Candidate \d+/
    );
    if (rc) {
        metadata.platform.minecraftVersion = rc[1];
    }

    let platformName = metadata.platform.name.toLowerCase();
    if (platformName === 'paper') {
        platformName = 'bukkit';
    } else if (metadata.platform.type === PlatformMetadata_Type.APPLICATION) {
        platformName = 'vanilla';
    }

    const id = platformName + '/' + metadata.platform.minecraftVersion;
    return mappingsInfo.auto[id];
}
