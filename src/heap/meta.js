import Head from 'next/head';
import { Avatar } from '../viewer/meta';

export function HeapTitle({ metadata }) {
    const { user } = metadata;
    return (
        <div className="textbox title">
            <Head>
                <title>Heap Summary | spark</title>
            </Head>
            <span>
                Heap Summary created by <Avatar user={user} />
                {user.name}
            </span>
        </div>
    );
}
