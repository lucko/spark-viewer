import Head from 'next/head';
import { SamplerMetadata } from '../proto';
import { Avatar } from '../viewer/meta';

export function ProfileTitle({ metadata }) {
    const { user, startTime, interval, dataAggregator } = metadata;

    const comment = metadata.comment ? '"' + metadata.comment + '"' : '';
    const [startTimeStr, startDateStr] = formatTime(startTime);

    let ticksOver = '';
    if (
        dataAggregator &&
        dataAggregator.type === SamplerMetadata.DataAggregator.Type.TICKED.value
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
                Profile {comment} created by <Avatar user={user} />
                {user.name} at {startTimeStr} on {startDateStr}, interval{' '}
                {interval / 1000}ms{ticksOver}
            </span>
        </div>
    );
}

export function formatTime(startTime) {
    const start = new Date(startTime);
    const time = start
        .toLocaleTimeString([], {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
        })
        .replace(' ', '');
    const date = start.toLocaleDateString();
    return [time, date];
}
