import React from 'react';
import { CommandSenderData, PlatformData } from '../proto';

export function Metadata({ metadata }) {
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
        const { user, startTime, interval } = metadata;

        let comment = '';
        if (metadata.comment) {
            comment = '"' + metadata.comment + '"';
        }

        const { type, name } = user;
        const start = new Date(startTime);
        const startTimeStr = start.toLocaleTimeString([], {hour12: true, hour: '2-digit', minute: '2-digit'}).replace(" ", "");
        const startDateStr = start.toLocaleDateString();

        let avatarUrl;
        if (type === CommandSenderData.Type.PLAYER.value) {
            const uuid = user.uniqueId.replace(/-/g, "");
            avatarUrl = 'https://minotar.net/avatar/' + uuid + '/20.png';
        } else {
            avatarUrl = 'https://minotar.net/avatar/Console/20.png';
        }

        document.title ='Profile' + comment + ' at ' +  startTimeStr + ' ' + startDateStr;

        return <>
            <span>
                Profile {comment} created by <img src={avatarUrl} alt="" /> {name} at {startTimeStr} on {startDateStr}, interval {interval / 1000}ms
            </span>
        </>
    }
    return null
}

const PlatformMetadata = ({ metadata }) => {
    if (metadata.platform) {
        const { platform } = metadata;
        const platformType = Object.keys(PlatformData.Type)[platform.type].toLowerCase();

        let title = platform.name + ' version "' + platform.version + '" (' + platformType + ')';
        if (platform.minecraftVersion) {
            title = title + ', Minecraft ' + platform.minecraftVersion;
        }

        return <>
            <span id="platform-data">
                {title}
            </span>
        </>
    }
    return null
}