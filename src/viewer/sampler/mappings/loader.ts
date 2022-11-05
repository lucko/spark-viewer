import {
    BukkitMappings,
    McpMappings,
    MojangMappings,
    SamplerData,
    YarnMappings,
} from '../../proto/spark_pb';
import detectMappings from './detect';
import { fetchMappings, MappingsMetadata } from './fetch';
import BukkitMappingFunction from './functions/bukkit';
import McpMappingFunction from './functions/mcp';
import NoOpMappingFunction from './functions/noop';
import YarnMappingFunction from './functions/yarn';
import { MappingFunction } from './types';

export default async function loadMappings(
    type: string,
    mappingsInfo: MappingsMetadata,
    profileData: SamplerData
): Promise<MappingFunction> {
    if (type === 'auto') {
        const detectedType = detectMappings(mappingsInfo, profileData);
        if (!detectedType) {
            return NoOpMappingFunction.INSTANCE;
        } else {
            type = detectedType;
        }
    }

    if (type.startsWith('bukkit-mojang')) {
        const version = type.substring('bukkit-mojang-'.length);
        const nmsVersion =
            mappingsInfo.types['bukkit-mojang'].versions[version].nmsVersion;
        const mojangClassNamesAtRuntime =
            mappingsInfo.types['bukkit-mojang'].versions[version]
                .mojangClassNamesAtRuntime;

        if (!nmsVersion && !mojangClassNamesAtRuntime) {
            throw new Error('No NMS version specified!');
        }

        const [mojangMappings, bukkitMappings] = await Promise.all([
            fetchMappings(version, 'mojang', arr =>
                MojangMappings.fromBinary(arr)
            ),
            fetchMappings(version, 'bukkit', arr =>
                BukkitMappings.fromBinary(arr)
            ),
        ]);

        return new BukkitMappingFunction(
            mojangMappings,
            bukkitMappings,
            nmsVersion
        );
    } else if (type.startsWith('bukkit')) {
        const version = type.substring('bukkit-'.length);
        const nmsVersion =
            mappingsInfo.types.bukkit.versions[version].nmsVersion;

        const [mcpMappings, bukkitMappings] = await Promise.all([
            fetchMappings(version, 'mcp', arr => McpMappings.fromBinary(arr)),
            fetchMappings(version, 'bukkit', arr =>
                BukkitMappings.fromBinary(arr)
            ),
        ]);

        return new BukkitMappingFunction(
            mcpMappings,
            bukkitMappings,
            nmsVersion
        );
    } else if (type.startsWith('mcp')) {
        const version = type.substring('mcp-'.length);

        const mcpMappings = await fetchMappings(version, 'mcp', arr =>
            McpMappings.fromBinary(arr)
        );
        return new McpMappingFunction(mcpMappings);
    } else if (type.startsWith('yarn')) {
        const version = type.substring('yarn-'.length);

        const yarnMappings = await fetchMappings(version, 'yarn', arr =>
            YarnMappings.fromBinary(arr)
        );
        return new YarnMappingFunction(yarnMappings);
    } else {
        return NoOpMappingFunction.INSTANCE;
    }
}
