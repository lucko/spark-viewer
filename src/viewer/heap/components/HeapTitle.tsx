import Head from 'next/head';
import Avatar from '../../common/components/Avatar';
import { HeapMetadata } from '../../proto/spark_pb';

export interface HeapTitleProps {
    metadata: HeapMetadata;
}

export default function HeapTitle({ metadata }: HeapTitleProps) {
    const { user } = metadata;
    return (
        <div className="textbox title">
            <Head>
                <title>Heap Summary | spark</title>
            </Head>
            <span>
                Heap Summary created by <Avatar user={user!} />
                {user?.name}
            </span>
        </div>
    );
}
