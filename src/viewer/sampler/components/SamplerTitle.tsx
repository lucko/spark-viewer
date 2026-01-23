import Head from 'next/head';
import Avatar from '../../common/components/Avatar';
import { formatBytesShort, formatDate } from '../../common/util/format';
import {
    SamplerMetadata,
    SamplerMetadata_DataAggregator_Type,
    SamplerMetadata_SamplerMode,
} from '../../proto/spark_pb';

export interface SamplerTitleProps {
    metadata: SamplerMetadata;
}

export default function SamplerTitle({ metadata }: SamplerTitleProps) {
    const { user, startTime, interval, dataAggregator } = metadata;

    const comment = metadata.comment ? '"' + metadata.comment + '"' : '';
    const [startTimeStr, startDateStr] = formatDate(startTime);

    let ticksOver = '';
    if (
        dataAggregator &&
        dataAggregator.type === SamplerMetadata_DataAggregator_Type.TICKED
    ) {
        ticksOver =
            ', ticks >= ' + dataAggregator.tickLengthThreshold / 1000 + 'ms';
    }

    const alloc =
        metadata.samplerMode === SamplerMetadata_SamplerMode.ALLOCATION;
    const title = alloc ? 'Memory Profile' : 'Profile';
    const formattedInterval = alloc
        ? formatBytesShort(interval)
        : `${interval / 1000}ms`;

    return (
        <div className="textbox title">
            <Head>
                <title>
                    {title} @ {startTimeStr} {startDateStr} | spark
                </title>
            </Head>
            <span>
                {comment}
                <Avatar user={user} platform={metadata.platform} />
                {user?.name} @ {startTimeStr} {startDateStr}, interval{' '}
                {formattedInterval}
                {ticksOver}
            </span>
        </div>
    );
}
