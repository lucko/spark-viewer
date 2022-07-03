import React, { useMemo, useState } from 'react';

import classNames from 'classnames';

import Widgets from './widgets';
import { detectOnlineMode, ServerConfigurations } from './serverConfigs';
import { formatDuration } from '../misc/util';

import {
    CommandSenderMetadata,
    PlatformMetadata as PlatformData,
} from '../proto';
import { WorldStatistics } from './world';

export function WidgetsAndMetadata({ metadata, metadataToggle }) {
    return (
        <div
            className={classNames({
                metadata: true,
                expanded: metadataToggle.showInfo,
            })}
            style={{
                display: metadataToggle.showWidgets ? null : 'none',
            }}
        >
            {!!metadata.platformStatistics && (
                <Widgets
                    metadata={metadata}
                    expanded={metadataToggle.showInfo}
                />
            )}

            {!!metadata.platform && metadataToggle.showInfo && (
                <MetadataDetail metadata={metadata} />
            )}
        </div>
    );
}

export function Avatar({ user }) {
    let avatarUrl;
    if (user.type === CommandSenderMetadata.Type.PLAYER.value) {
        const uuid = user.uniqueId.replace(/-/g, '');
        avatarUrl = 'https://crafthead.net/helm/' + uuid + '/20.png';
    } else {
        avatarUrl = 'https://crafthead.net/avatar/Console/20.png';
    }

    return <img src={avatarUrl} alt="" />;
}

export function MetadataDetail({ metadata }) {
    const {
        platform,
        platformStatistics,
        systemStatistics,
        serverConfigurations,
    } = metadata;
    const platformType = Object.keys(PlatformData.Type)[
        platform.type
    ].toLowerCase();

    const { parsedConfigurations, onlineMode } = useMemo(() => {
        let parsedConfigurations;
        let onlineMode;

        if (serverConfigurations && Object.keys(serverConfigurations).length) {
            parsedConfigurations = objectMap(serverConfigurations, JSON.parse);
            try {
                onlineMode = detectOnlineMode(parsedConfigurations);
            } catch (e) {
                // ignore
            }
        }
        return { parsedConfigurations, onlineMode };
    }, [serverConfigurations]);

    const runningTime =
        metadata.endTime && metadata.startTime
            ? metadata.endTime - metadata.startTime
            : undefined;

    const numberOfTicks = metadata.numberOfTicks;
    const numberOfIncludedTicks = metadata.dataAggregator?.numberOfIncludedTicks;

    const [view, setView] = useState('Platform');
    const views = {
        'Platform': () => true,
        'JVM Flags': () => systemStatistics?.java.vmArgs,
        'Configurations': () => parsedConfigurations,
        'World': () =>
            platformStatistics?.world &&
            platformStatistics?.world?.totalEntities,
    };

    return (
        <div className="text-box metadata-detail">
            <ul className="metadata-detail-controls">
                {Object.entries(views).map(([name, func]) => {
                    return (
                        !!func() && (
                            <li
                                key={name}
                                onClick={() => setView(name)}
                                className={view === name ? 'selected' : null}
                            >
                                {name}
                            </li>
                        )
                    );
                })}
            </ul>

            {view === 'Platform' ? (
                <PlatformStatistics
                    platform={platform}
                    platformStatistics={platformStatistics}
                    systemStatistics={systemStatistics}
                    platformType={platformType}
                    onlineMode={onlineMode}
                    runningTime={runningTime}
                    numberOfTicks={numberOfTicks}
                    numberOfIncludedTicks={numberOfIncludedTicks}
                />
            ) : view === 'JVM Flags' ? (
                <JvmStartupArgs systemStatistics={systemStatistics} />
            ) : view === 'Configurations' ? (
                <ServerConfigurations
                    parsedConfigurations={parsedConfigurations}
                />
            ) : (
                <WorldStatistics worldStatistics={platformStatistics.world} />
            )}
        </div>
    );
}

const PlatformStatistics = ({
    platform,
    platformStatistics,
    systemStatistics,
    platformType,
    onlineMode,
    runningTime,
    numberOfTicks,
    numberOfIncludedTicks,
}) => {
    return (
        <>
            <p>
                The platform is a <span>{platform.name}</span> {platformType}{' '}
                running version &quot;
                <span>{platform.version}</span>&quot;.
            </p>
            {platform.minecraftVersion && (
                <p>
                    The detected Minecraft version is &quot;
                    <span>{platform.minecraftVersion}</span>&quot;.
                </p>
            )}
            {onlineMode && (
                <p>
                    The server is running in <span>{onlineMode}</span>.
                </p>
            )}
            {platformStatistics?.playerCount > 0 && (
                <p>
                    The server had a player count of{' '}
                    <span>{platformStatistics.playerCount}</span> when the
                    profile completed.
                </p>
            )}
            {!!systemStatistics && (
                <SystemStatistics systemStatistics={systemStatistics} />
            )}
            {runningTime && (
                <p>
                    The profiler was running for{' '}
                    <span>{formatDuration(runningTime)}</span>
                    {!!numberOfTicks && (
                        <>
                            {' '}
                            (<span>{numberOfTicks}</span> ticks)
                        </>
                    )}
                    .
                    {!!numberOfIncludedTicks && (
                        <>
                            {' '}
                            <span>{numberOfIncludedTicks}</span> ticks exceeded
                            the 'only ticks over' threshold.
                        </>
                    )}
                </p>
            )}
        </>
    );
};

const SystemStatistics = ({ systemStatistics }) => {
    return (
        <>
            <p>
                The system is running <span>{systemStatistics.os.name}</span> (
                <span>{systemStatistics.os.arch}</span>) version &quot;
                <span>{systemStatistics.os.version}</span>&quot; and has{' '}
                <span>{systemStatistics.cpu.threads}</span> CPU threads
                available.
            </p>
            {systemStatistics.cpu.modelName && (
                <p>
                    The CPU is described as an{' '}
                    <span>{systemStatistics.cpu.modelName}</span>.
                </p>
            )}
            <p>
                The process is using Java{' '}
                <span>{systemStatistics.java.version}</span> (
                <span>{systemStatistics.java.vendorVersion}</span> from{' '}
                <span>{systemStatistics.java.vendor}</span>).
            </p>
            <p>
                The current process uptime is{' '}
                <span>{formatDuration(systemStatistics.uptime)}</span>.
            </p>
        </>
    );
};

const JvmStartupArgs = ({ systemStatistics }) => {
    return (
        <p>
            The JVM was started with the following arguments:
            <br />
            <br />
            <span
                style={{
                    maxWidth: '1000px',
                    display: 'inline-block',
                    color: 'inherit',
                }}
            >
                {systemStatistics.java.vmArgs}
            </span>
        </p>
    );
};

const objectMap = (obj, fn) => {
    return Object.fromEntries(
        Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)])
    );
};
