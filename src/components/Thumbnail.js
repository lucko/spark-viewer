import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef } from 'react';

import SparkLogo from '../assets/spark-logo.svg';
import { formatDuration } from '../misc/util';
import { PlatformMetadata as PlatformData } from '../proto';
import { formatTime } from '../sampler/meta';
import { Avatar } from '../viewer/meta';
import Widgets from '../viewer/widgets';

import {
    faClock,
    faGamepad,
    faServer,
} from '@fortawesome/free-solid-svg-icons';

export default function Thumbnail({ data, code }) {
    const ref = useRef();
    const metadata = data.metadata;

    // override the css of body/#root to fix a specific size
    useEffect(() => {
        const rootElement = ref.current.parentElement;
        rootElement.style.minHeight = 'unset';
        rootElement.style.width = '100%';
        rootElement.style.height = '100%';

        const bodyElement = rootElement.parentElement;
        bodyElement.style.width = '1200px';
        bodyElement.style.height = '600px';

        const htmlElement = bodyElement.parentElement;
        htmlElement.style.backgroundColor = '#fff';
    }, []);

    let { platform, platformStatistics } = metadata;

    if (!platform) {
        platform = {
            name: 'Unknown',
            version: 'unknown',
            type: 0,
        };
    }

    const platformType = Object.keys(PlatformData.Type)[
        platform.type
    ].toLowerCase();

    const [startTime, startDate] = formatTime(metadata.startTime);

    const runningTime =
        metadata.endTime && metadata.startTime
            ? metadata.endTime - metadata.startTime
            : undefined;
    const numberOfTicks = metadata.numberOfTicks;

    return (
        <div ref={ref} className="thumbnail">
            <div>
                <h1>spark {data.threads ? 'profile' : 'heap summary'}</h1>
                <h2>/{code}</h2>
            </div>

            {platformStatistics && (
                <Widgets metadata={metadata} expanded={false}></Widgets>
            )}

            <div className="stats">
                <p>
                    <FontAwesomeIcon fixedWidth={true} icon={faServer} />{' '}
                    <span>{platform.name}</span> {platformType} &quot;
                    <span>{platform.version}</span>&quot;
                </p>
                {platformStatistics?.playerCount > 0 && (
                    <p>
                        <FontAwesomeIcon fixedWidth={true} icon={faGamepad} />{' '}
                        <span>{platformStatistics.playerCount}</span> players
                        online
                    </p>
                )}
                {runningTime && (
                    <p>
                        <FontAwesomeIcon fixedWidth={true} icon={faClock} />{' '}
                        Duration <span>{formatDuration(runningTime)}</span>
                        {!!numberOfTicks && (
                            <>
                                {' '}
                                (<span>{numberOfTicks}</span> ticks)
                            </>
                        )}
                    </p>
                )}
            </div>

            <div className="footer">
                <p>
                    Uploaded by <Avatar user={metadata.user} />
                    {metadata.user.name}
                    {metadata.startTime && (
                        <>
                            {' '}
                            • {startDate} at {startTime}
                        </>
                    )}
                </p>
                <SparkLogo alt="" width="65px" height="65px" />
            </div>
        </div>
    );
}
