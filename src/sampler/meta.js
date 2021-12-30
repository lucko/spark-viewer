import React from 'react';
import BannerNotice from '../components/BannerNotice';
import { formatDuration } from '../misc/util';
import {
    CommandSenderMetadata,
    PlatformMetadata as PlatformData,
    SamplerMetadata,
} from '../proto';

export function MetadataTitle({ metadata }) {
    const { user, startTime, interval, dataAggregator } = metadata;

    const comment = metadata.comment ? '"' + metadata.comment + '"' : '';

    const start = new Date(startTime);
    const startTimeStr = start
        .toLocaleTimeString([], {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
        })
        .replace(' ', '');
    const startDateStr = start.toLocaleDateString();

    document.title =
        'Profile' + comment + ' at ' + startTimeStr + ' ' + startDateStr;

    let ticksOver = '';
    if (
        dataAggregator &&
        dataAggregator.type === SamplerMetadata.DataAggregator.Type.TICKED.value
    ) {
        ticksOver =
            ', ticks >= ' + dataAggregator.tickLengthThreshold / 1000 + 'ms';
    }

    return (
        <div className="banner-notice metadata">
            <span>
                Profile {comment} created by <Avatar user={user} />
                {user.name} at {startTimeStr} on {startDateStr}, interval{' '}
                {interval / 1000}ms{ticksOver}
            </span>
        </div>
    );
}

export function MetadataDetail({ metadata }) {
    const { platform, systemStatistics } = metadata;
    const platformType = Object.keys(PlatformData.Type)[
        platform.type
    ].toLowerCase();

    return (
        <div className="banner-notice metadata-detail">
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
            {!!systemStatistics && (
                <>
                    <p>
                        The system is running{' '}
                        <span>{systemStatistics.os.name}</span> (
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
                    {systemStatistics.java.vmArgs && (
                        <>
                            <br />
                            <p>
                                <span>
                                    The JVM was started with the following
                                    arguments
                                </span>
                                : <br />
                                <div
                                    style={{
                                        maxWidth: '1000px',
                                        display: 'inline-block',
                                    }}
                                >
                                    {systemStatistics.java.vmArgs}
                                </div>
                            </p>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

const Avatar = ({ user }) => {
    let avatarUrl;
    if (user.type === CommandSenderMetadata.Type.PLAYER.value) {
        const uuid = user.uniqueId.replace(/-/g, '');
        avatarUrl = 'https://crafthead.net/helm/' + uuid + '/20.png';
    } else {
        avatarUrl = 'https://crafthead.net/avatar/Console/20.png';
    }

    return <img src={avatarUrl} alt="" />;
};

export function VersionWarning() {
    const warning = (
        <span role="img" aria-label="warning">
            ⚠️
        </span>
    );
    return (
        <BannerNotice style={{ color: 'orange', textAlign: 'center' }}>
            {warning}
            <b> This profile was created using an old version of spark! </b>
            {warning}
            <br />
            Some viewer features cannot be supported. Please consider updating
            to a newer version.
        </BannerNotice>
    );
}
