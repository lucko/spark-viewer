import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import sparkLogo from '../assets/spark-logo.svg';
import Widgets from '../viewer/widgets';
import { Avatar } from '../viewer/meta';
import { formatTime } from '../sampler/meta';
import { formatDuration } from '../misc/util';
import { PlatformMetadata as PlatformData } from '../proto';

import {
    faClock,
    faGamepad,
    faServer,
} from '@fortawesome/free-solid-svg-icons';

import '../style/thumbnail.scss';

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
    });

    const { platform, platformStatistics } = metadata;
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
                <h1>Spark {data.threads ? 'Profile' : 'Heap Summary'}</h1>
                <h2>/{code}</h2>
            </div>

            <Widgets metadata={metadata} expanded={false}></Widgets>

            <div className="stats">
                {runningTime && (
                    <p>
                        <FontAwesomeIcon fixedWidth={true} icon={faClock} />{' '}
                        <span>{formatDuration(runningTime)}</span>
                        {!!numberOfTicks && (
                            <>
                                {' '}
                                (<span>{numberOfTicks}</span> ticks)
                            </>
                        )}
                    </p>
                )}
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
                <img src={sparkLogo} alt="" width="65px" height="65px" />
            </div>
        </div>
    );
}
