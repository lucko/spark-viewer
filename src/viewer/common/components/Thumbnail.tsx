import {
    faClock,
    faDatabase,
    faGamepad,
    faServer,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import SparkLogo from '../../../assets/spark-logo.svg';
import styles from '../../../style/thumbnail.module.scss';
import { isSamplerMetadata } from '../../proto/guards';
import {
    HeapMetadata,
    PlatformMetadata_Type,
    SamplerMetadata,
    SamplerMetadata_SamplerMode,
} from '../../proto/spark_pb';
import { formatDuration } from '../util/format';
import { unwrapSamplerMetadata } from '../util/metadata';
import Avatar from './Avatar';
import Widgets from './widgets/Widgets';

export interface ThumbnailProps {
    metadata: SamplerMetadata | HeapMetadata;
    code: string;
}

export default function Thumbnail({ metadata, code }: ThumbnailProps) {
    const ref = useRef<HTMLDivElement>(null);

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
            brand: 'Unknown',
            version: 'unknown',
            type: 0,
        };
    }

    const platformType = PlatformMetadata_Type[platform.type].toLowerCase();

    const { startTime, startDate, runningTime, numberOfTicks, samplerMode } =
        unwrapSamplerMetadata(metadata);

    return (
        <div ref={ref} className={classNames('thumbnail', styles.thumbnail)}>
            <div>
                <h1>
                    spark{' '}
                    {isSamplerMetadata(metadata) ? 'profile' : 'heap summary'}
                </h1>
                <h2>/{code}</h2>
            </div>

            {!!platformStatistics && (
                <Widgets metadata={metadata} expanded={true}></Widgets>
            )}

            <div className="stats">
                {samplerMode === SamplerMetadata_SamplerMode.ALLOCATION && (
                    <p>
                        <FontAwesomeIcon fixedWidth={true} icon={faDatabase} />{' '}
                        <span>Allocation</span> (memory) profile
                    </p>
                )}
                <p>
                    <FontAwesomeIcon fixedWidth={true} icon={faServer} />{' '}
                    <span>{platform.brand || platform.name}</span> {platformType} &quot;
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
