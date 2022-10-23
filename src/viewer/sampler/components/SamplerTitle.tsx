import Head from 'next/head';
import Avatar from '../../common/components/Avatar';
import { formatDate } from '../../common/util/format';
import {
    SamplerMetadata,
    SamplerMetadata_DataAggregator_Type,
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

    return (
        <div className="textbox title">
            <Head>
                <title>
                    Profile @ {startTimeStr} {startDateStr} | spark
                </title>
            </Head>
            <span>
                Profile {comment} created by <Avatar user={user!} />
                {user?.name} at {startTimeStr} on {startDateStr}, interval{' '}
                {interval / 1000}ms{ticksOver}
            </span>
        </div>
    );
}
