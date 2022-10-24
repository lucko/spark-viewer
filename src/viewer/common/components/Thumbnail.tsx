import {
    faClock,
    faGamepad,
    faServer,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import SparkLogo from '../../../assets/spark-logo.svg';
import styles from '../../../style/thumbnail.module.scss';
import {
    HeapData,
    PlatformMetadata_Type,
    SamplerData,
} from '../../proto/spark_pb';
import { formatDuration } from '../util/format';
import { unwrapSamplerMetadata } from '../util/metadata';
import Avatar from './Avatar';
import Widgets from './widgets/Widgets';

export interface ThumbnailProps {
    data: SamplerData | HeapData;
    code: string;
}

export default function Thumbnail({ data, code }: ThumbnailProps) {
    const ref = useRef<HTMLDivElement>(null);
    const metadata = data.metadata!;

    // override the css of body/#root to fix a specific size
    useEffect(() => {
        const rootElement = ref.current!.parentElement!;
        rootElement.style.minHeight = 'unset';
        rootElement.style.width = '100%';
        rootElement.style.height = '100%';

        const bodyElement = rootElement.parentElement!;
        bodyElement.style.width = '1200px';
        bodyElement.style.height = '600px';

        const htmlElement = bodyElement.parentElement!;
        htmlElement.style.backgroundColor = '#fff';
    }, []);

    let { platform, platformStatistics } = metadata;

    if (!platform) {
        platform = {
            minecraftVersion: '',
            sparkVersion: 0,
            name: 'Unknown',
            version: 'unknown',
            type: 0,
        };
    }

    const platformType = PlatformMetadata_Type[platform.type].toLowerCase();

    const { startTime, startDate, runningTime, numberOfTicks } =
        unwrapSamplerMetadata(metadata);

    return (
        <div ref={ref} className={classNames('thumbnail', styles.thumbnail)}>
            <div>
                <h1>spark {'threads' in data ? 'profile' : 'heap summary'}</h1>
                <h2>/{code}</h2>
            </div>

            {!!platformStatistics && (
                <Widgets metadata={metadata} expanded={true}></Widgets>
            )}

            <div className="stats">
                <p>
                    <FontAwesomeIcon fixedWidth={true} icon={faServer} />{' '}
                    <span>{platform.name}</span> {platformType} &quot;
                    <span>{platform.version}</span>&quot;
                </p>
                {!!platformStatistics?.playerCount && (
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
                    Uploaded by <Avatar user={metadata.user!} />
                    {metadata.user?.name}
                    {startTime && (
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
