import { isSamplerMetadata } from '../../proto/guards';
import { HeapMetadata, SamplerMetadata } from '../../proto/spark_pb';
import { formatDate } from './format';

export interface UnwrappedSamplerMetadata {
    startTime?: string;
    startDate?: string;
    runningTime?: number;
    numberOfTicks?: number;
    numberOfIncludedTicks?: number;
}

export function unwrapSamplerMetadata(
    metadata: SamplerMetadata | HeapMetadata
): UnwrappedSamplerMetadata {
    if (isSamplerMetadata(metadata)) {
        const [startTime, startDate] = formatDate(metadata.startTime);
        const runningTime =
            metadata.endTime && metadata.startTime
                ? metadata.endTime - metadata.startTime
                : undefined;
        const numberOfTicks = metadata.numberOfTicks;
        const numberOfIncludedTicks =
            metadata.dataAggregator?.numberOfIncludedTicks;
        return {
            startTime,
            startDate,
            runningTime,
            numberOfTicks,
            numberOfIncludedTicks,
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

export function detectOnlineMode(
    parsedConfigurations: Record<string, any>
): string {
    const serverProperties = parsedConfigurations['server.properties'];
    const spigotConfig = parsedConfigurations['spigot.yml'];
    const oldPaperConfig = parsedConfigurations['paper.yml'];
    const newPaperConfig = parsedConfigurations['paper/']?.['global.yml'];

    if (serverProperties?.['online-mode'] === true) {
        return 'online mode';
    }

    if (spigotConfig?.settings?.bungeecord === true) {
        if (
            oldPaperConfig?.['settings']?.['bungee-online-mode'] === false ||
            newPaperConfig?.['proxies']?.['bungee-cord']?.['online-mode'] ===
                false
        ) {
            return 'offline mode (BungeeCord)';
        }

        return 'online mode (BungeeCord)';
    }

    if (
        oldPaperConfig?.['settings']?.['velocity-support']?.enabled === true ||
        newPaperConfig?.['proxies']?.['velocity']?.enabled === true
    ) {
        if (
            oldPaperConfig?.['settings']?.['velocity-support']?.[
                'online-mode'
            ] === false ||
            newPaperConfig?.['proxies']?.['velocity']?.['online-mode'] === false
        ) {
            return 'offline mode (Velocity)';
        }

        return 'online mode (Velocity)';
    }

    return 'offline mode';
}
