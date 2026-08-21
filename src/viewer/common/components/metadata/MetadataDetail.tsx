import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo, useState } from 'react';
import { SparkMetadata } from '../../../proto/guards';
import { PlatformMetadata_Type } from '../../../proto/spark_pb';
import {
    detectOnlineMode,
    objectMap,
    unwrapSamplerMetadata,
} from '../../util/metadata';
import ExtraPlatformMetadata from './tabs/ExtraPlatformMetadata';
import GameRules from './tabs/GameRules';
import JvmStartupArgs from './tabs/JvmStartupArgs';
import MemoryStatistics from './tabs/MemoryStatistics';
import NetworkStatistics from './tabs/NetworkStatistics';
import PlatformStatistics from './tabs/PlatformStatistics';
import PluginsModsList from './tabs/PluginsModsList';
import ServerConfigurations from './tabs/ServerConfigurations';
import WorldStatistics from './tabs/WorldStatistics';

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
        <div className="metadata-detail">
            <div className="header">
                <h2>
                    <FontAwesomeIcon icon={faInfoCircle} /> Metadata
                </h2>
                <p>
                    The panel below shows metadata/information about the
                    platform, system, and world. You can switch between
                    different views using the buttons below.
                </p>
            </div>

            <div className="metadata-detail-controls">
                {Object.entries(views).map(([name, func]) => {
                    return (
                        func() && (
                            <div
                                key={name}
                                onClick={() => setView(name)}
                                className={
                                    'textbox' +
                                    (view === name ? ' toggled' : '')
                                }
                            >
                                {name}
                            </div>
                        )
                    );
                })}
            </div>

            <div className="metadata-detail-content textbox">
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
