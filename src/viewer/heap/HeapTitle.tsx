import Head from 'next/head';
import Avatar from '../common/components/Avatar';
import { formatDate } from '../common/util/format';
import { HeapMetadata } from '../proto/spark_pb';

export interface HeapTitleProps {
    metadata: HeapMetadata;
}

export default function HeapTitle({ metadata }: HeapTitleProps) {
    const { user, generatedTime } = metadata;

    let time;
    if (generatedTime) {
        const [timeStr, dateStr] = formatDate(generatedTime);
        time = ` @ ${timeStr} ${dateStr}`;
    } else {
        time = '';
    }

    return (
        <div className="textbox title">
            <Head>
                <title>Heap Summary{time} | spark</title>
            </Head>
            <span>
                Heap Summary created by{' '}
                <Avatar user={user} platform={metadata.platform} />
                {user?.name}
                {time}
            </span>
        </div>
    );
}
