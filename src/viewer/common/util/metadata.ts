import { isSamplerMetadata, SparkMetadata } from '../../proto/guards';
import {
    PlatformStatistics_OnlineMode,
    SamplerMetadata_SamplerMode,
} from '../../proto/spark_pb';
import { formatDate } from './format';

export interface UnwrappedDateMetadata {
    time?: string;
    date?: string;
}

export interface UnwrappedSamplerMetadata {
    runningTime?: number;
    numberOfTicks?: number;
    numberOfIncludedTicks?: number;
    samplerMode?: SamplerMetadata_SamplerMode;
}

export function unwrapDateMetadata(metadata: SparkMetadata) {
    if (isSamplerMetadata(metadata)) {
        const [time, date] = formatDate(metadata.startTime);
        return { time, date };
    } else if (metadata.generatedTime) {
        const [time, date] = formatDate(metadata.generatedTime);
        return { time, date };
    } else {
        return {};
    }
}

export function unwrapSamplerMetadata(
    metadata: SparkMetadata
): UnwrappedSamplerMetadata {
    if (isSamplerMetadata(metadata)) {
        const runningTime =
            metadata.endTime && metadata.startTime
                ? metadata.endTime - metadata.startTime
                : undefined;
        const numberOfTicks = metadata.numberOfTicks;
        const numberOfIncludedTicks =
            metadata.dataAggregator?.numberOfIncludedTicks;
        const samplerMode = metadata.samplerMode;
        return {
            runningTime,
            numberOfTicks,
            numberOfIncludedTicks,
            samplerMode,
        };
    } else {
        return {};
    }
}

export function objectMap<K extends string | number | symbol, V1, V2>(
    obj: Record<K, V1>,
    fn: (v: V1, k: K, i: number) => V2
): Record<K, V2> {
    return Object.fromEntries(
        Object.entries(obj).map(([k, v], i) => [k, fn(v as V1, k as K, i)])
    ) as Record<K, V2>;
}

type ProxyKind = 'BungeeCord' | 'Velocity';
export type OnlineModeStatus =
    | 'online mode'
    | 'offline mode'
    | `online mode (${ProxyKind})`
    | `offline mode (${ProxyKind})`;

export function detectOnlineMode(
    onlineMode: PlatformStatistics_OnlineMode | undefined,
    parsedConfigurations: Record<string, any> | undefined
): OnlineModeStatus {
    if (onlineMode === PlatformStatistics_OnlineMode.ONLINE) {
        return 'online mode';
    }
    if (onlineMode === PlatformStatistics_OnlineMode.OFFLINE) {
        return 'offline mode';
    }

    if (parsedConfigurations) {
        const serverProperties = parsedConfigurations['server.properties'];
        if (serverProperties?.['online-mode'] === true) {
            return 'online mode';
        }

        const spigotConfig = parsedConfigurations['spigot.yml'];
        const oldPaperConfig = parsedConfigurations['paper.yml'];
        const newPaperConfig = parsedConfigurations['paper/']?.['global.yml'];

        if (spigotConfig?.settings?.bungeecord === true) {
            if (
                oldPaperConfig?.['settings']?.['bungee-online-mode'] ===
                    false ||
                newPaperConfig?.['proxies']?.['bungee-cord']?.[
                    'online-mode'
                ] === false
            ) {
                return 'offline mode (BungeeCord)';
            }

            return 'online mode (BungeeCord)';
        }

        if (
            oldPaperConfig?.['settings']?.['velocity-support']?.enabled ===
                true ||
            newPaperConfig?.['proxies']?.['velocity']?.enabled === true
        ) {
            if (
                oldPaperConfig?.['settings']?.['velocity-support']?.[
                    'online-mode'
                ] === false ||
                newPaperConfig?.['proxies']?.['velocity']?.['online-mode'] ===
                    false
            ) {
                return 'offline mode (Velocity)';
            }

            return 'online mode (Velocity)';
        }
    }

    return 'offline mode';
}
