import { useMemo, useState } from 'react';
import { SparkMetadata } from '../../../proto/guards';
import { PlatformMetadata_Type } from '../../../proto/spark_pb';
import {
    detectOnlineMode,
    objectMap,
    unwrapSamplerMetadata,
} from '../../util/metadata';
import ExtraPlatformMetadata from './ExtraPlatformMetadata';
import GameRules from './GameRules';
import JvmStartupArgs from './JvmStartupArgs';
import MemoryStatistics from './MemoryStatistics';
import NetworkStatistics from './NetworkStatistics';
import PlatformStatistics from './PlatformStatistics';
import PluginsModsList from './PluginsModsList';
import ServerConfigurations from './ServerConfigurations';
import WorldStatistics from './WorldStatistics';

interface MetadataDetailProps {
    metadata: SparkMetadata;
}

export default function MetadataDetail({ metadata }: MetadataDetailProps) {
    const {
        platform,
        platformStatistics,
        systemStatistics,
        serverConfigurations,
        extraPlatformMetadata,
    } = metadata;
    const platformType = PlatformMetadata_Type[platform!.type].toLowerCase();

    const { parsedConfigurations, onlineMode } = useMemo(() => {
        let parsedConfigurations: Record<string, any> | undefined;
        let onlineMode: string | undefined;

        if (serverConfigurations && Object.keys(serverConfigurations).length) {
            parsedConfigurations = objectMap(serverConfigurations, v =>
                JSON.parse(v)
            );
        }

        try {
            onlineMode = detectOnlineMode(
                platformStatistics?.onlineMode,
                parsedConfigurations
            );
        } catch (e) {
            // ignore
        }
        return { parsedConfigurations, onlineMode };
    }, [serverConfigurations, platformStatistics]);

    const parsedExtraMetadata = useMemo(() => {
        if (
            extraPlatformMetadata &&
            Object.keys(extraPlatformMetadata).length
        ) {
            return objectMap(extraPlatformMetadata, v => JSON.parse(v));
        }
    }, [extraPlatformMetadata]);

    const { runningTime, numberOfTicks, numberOfIncludedTicks, samplerEngine } =
        unwrapSamplerMetadata(metadata);

    const [view, setView] = useState('Platform');
    const views: Record<string, () => boolean> = {
        'Platform': () => true,
        'Memory': () =>
            !!platformStatistics?.memory?.heap ||
            !!platformStatistics?.memory?.pools?.length,
        'Network': () => !!Object.keys(systemStatistics?.net ?? {}).length,
        'JVM Flags': () => !!systemStatistics?.java?.vmArgs,
        'Configurations': () => !!parsedConfigurations,
        'World': () =>
            !!platformStatistics?.world &&
            !!platformStatistics?.world?.totalEntities,
        'Misc': () => !!parsedExtraMetadata,
        'Game Rules': () => !!platformStatistics?.world?.gameRules.length,
        'Plugins/Mods': () =>
            !!platformStatistics?.world?.dataPacks.length ||
            !!Object.keys(metadata.sources).length,
    };

    return (
        <div className="textbox metadata-detail">
            <div className="metadata-detail-controls">
                {Object.entries(views).map(([name, func]) => {
                    return (
                        !!func() && (
                            <div
                                key={name}
                                onClick={() => setView(name)}
                                className={
                                    view === name ? 'toggled' : undefined
                                }
                            >
                                {name}
                            </div>
                        )
                    );
                })}
            </div>

            <div className="metadata-detail-content">
                {view === 'Platform' ? (
                    <PlatformStatistics
                        platform={platform!}
                        platformStatistics={platformStatistics!}
                        systemStatistics={systemStatistics}
                        platformType={platformType}
                        onlineMode={onlineMode}
                        runningTime={runningTime}
                        numberOfTicks={numberOfTicks}
                        numberOfIncludedTicks={numberOfIncludedTicks}
                        engine={samplerEngine}
                    />
                ) : view === 'Memory' ? (
                    <MemoryStatistics
                        memory={platformStatistics?.memory!}
                        gc={platformStatistics?.gc!}
                    />
                ) : view === 'Network' ? (
                    <NetworkStatistics systemStatistics={systemStatistics!} />
                ) : view === 'JVM Flags' ? (
                    <JvmStartupArgs systemStatistics={systemStatistics!} />
                ) : view === 'Configurations' ? (
                    <ServerConfigurations
                        parsedConfigurations={parsedConfigurations!}
                    />
                ) : view === 'World' ? (
                    <WorldStatistics
                        worldStatistics={platformStatistics!.world!}
                    />
                ) : view === 'Game Rules' ? (
                    <GameRules
                        gameRules={platformStatistics?.world?.gameRules!}
                    />
                ) : view === 'Plugins/Mods' ? (
                    <PluginsModsList
                        plugins={Object.values(metadata.sources || {})}
                        dataPacks={platformStatistics?.world?.dataPacks || []}
                    />
                ) : view === 'Misc' ? (
                    <ExtraPlatformMetadata data={parsedExtraMetadata!} />
                ) : (
                    <p>Unknown view.</p>
                )}
            </div>
        </div>
    );
}
