import React from 'react';
import { CommandSenderData, PlatformData, SamplerMetadata } from '../proto';

export default function Metadata({ metadata }) {
    let commonData = <CommonMetadata metadata={metadata} />
    let platformData = <PlatformMetadata metadata={metadata} />
    return <>
        {!!metadata.platform
            ? <details id="metadata" className="banner-notice"><summary>{commonData}</summary>{platformData}</details>
            : <div id="metadata" className="banner-notice">{commonData}</div>
        }
    </>
}

const CommonMetadata = ({ metadata }) => {
    if (metadata.user && metadata.startTime && metadata.interval) {
        const { user, startTime, interval, dataAggregator } = metadata;

        const comment = metadata.comment ? '"' + metadata.comment + '"' : '';

        const start = new Date(startTime);
        const startTimeStr = start.toLocaleTimeString([], {hour12: true, hour: '2-digit', minute: '2-digit'}).replace(" ", "");
        const startDateStr = start.toLocaleDateString();

        let avatarUrl;
        if (user.type === CommandSenderData.Type.PLAYER.value) {
            const uuid = user.uniqueId.replace(/-/g, "");
            avatarUrl = 'https://minotar.net/avatar/' + uuid + '/20.png';
        } else {
            avatarUrl = 'https://minotar.net/avatar/Console/20.png';
        }

        document.title = 'Profile' + comment + ' at ' +  startTimeStr + ' ' + startDateStr;

        let ticksOver = '';
        if (dataAggregator && dataAggregator.type === SamplerMetadata.DataAggregator.Type.TICKED.value) {
            ticksOver = ', ticks >= ' + dataAggregator.tickLengthThreshold / 1000 + 'ms';
        }

        return <span>
            Profile {comment} created by <img src={avatarUrl} alt="" />{user.name} at {startTimeStr} on {startDateStr}, interval {interval / 1000}ms{ticksOver}
        </span>;
    }
    return null
}

const PlatformMetadata = ({ metadata }) => {
    if (metadata.platform) {
        const { platform } = metadata;
        const platformType = Object.keys(PlatformData.Type)[platform.type].toLowerCase();

        let title = platform.name + ' version "' + platform.version + '" (' + platformType + ')';
        if (platform.minecraftVersion) {
            title += ', Minecraft ' + platform.minecraftVersion;
        }

        return <span id="platform-data">{title}</span>
    }
    return null
}