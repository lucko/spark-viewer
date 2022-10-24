import { useMemo, useState } from 'react';
import { isSamplerMetadata } from '../../../proto/guards';
import {
    HeapMetadata,
    PlatformMetadata_Type,
    SamplerMetadata,
} from '../../../proto/spark_pb';
import {
    detectOnlineMode,
    objectMap,
    unwrapSamplerMetadata,
} from '../../util/metadata';
import ExtraPlatformMetadata from './ExtraPlatformMetadata';
import JvmStartupArgs from './JvmStartupArgs';
import PlatformStatistics from './PlatformStatistics';
import ServerConfigurations from './ServerConfigurations';
import WorldStatistics from './WorldStatistics';

interface MetadataDetailProps {
    metadata: SamplerMetadata | HeapMetadata;
}

export default function MetadataDetail({ metadata }: MetadataDetailProps) {
    const { platform, platformStatistics, systemStatistics } = metadata;

    let serverConfigurations: Record<string, string> | undefined;
    let extraPlatformMetadata: Record<string, string> | undefined;
    if (isSamplerMetadata(metadata)) {
        serverConfigurations = metadata.serverConfigurations;
        extraPlatformMetadata = metadata.extraPlatformMetadata;
    }

    const platformType = Object.keys(PlatformMetadata_Type)[
        platform!.type
    ].toLowerCase();

    const { parsedConfigurations, onlineMode } = useMemo(() => {
        let parsedConfigurations: Record<string, any> | undefined;
        let onlineMode: string | undefined;

        if (serverConfigurations && Object.keys(serverConfigurations).length) {
            parsedConfigurations = objectMap(serverConfigurations, v =>
                JSON.parse(v)
            );
            try {
                onlineMode = detectOnlineMode(parsedConfigurations);
            } catch (e) {
                // ignore
            }
        }
        return { parsedConfigurations, onlineMode };
    }, [serverConfigurations]);

    const parsedExtraMetadata = useMemo(() => {
        if (
            extraPlatformMetadata &&
            Object.keys(extraPlatformMetadata).length
        ) {
            return objectMap(extraPlatformMetadata, v => JSON.parse(v));
        }
    }, [extraPlatformMetadata]);

    const { runningTime, numberOfTicks, numberOfIncludedTicks } =
        unwrapSamplerMetadata(metadata);

    const [view, setView] = useState('Platform');
    const views = {
        'Platform': () => true,
        'JVM Flags': () => systemStatistics?.java?.vmArgs,
        'Configurations': () => parsedConfigurations,
        'World': () =>
            platformStatistics?.world &&
            platformStatistics?.world?.totalEntities,
        'Misc': () => !!parsedExtraMetadata,
    };

    return (
        <div className="textbox metadata-detail">
            <ul className="metadata-detail-controls">
                {Object.entries(views).map(([name, func]) => {
                    return (
                        !!func() && (
                            <li
                                key={name}
                                onClick={() => setView(name)}
                                className={
                                    view === name ? 'selected' : undefined
                                }
                            >
                                {name}
                            </li>
                        )
                    );
                })}
            </ul>

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
                    />
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
                ) : view === 'Misc' ? (
                    <ExtraPlatformMetadata data={parsedExtraMetadata!} />
                ) : (
                    <p>Unknown view.</p>
                )}
            </div>
        </div>
    );
}
