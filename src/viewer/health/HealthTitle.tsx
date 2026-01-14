import Head from 'next/head';
import Avatar from '../common/components/Avatar';
import { formatDate } from '../common/util/format';
import { HealthMetadata, PlatformMetadata_Type } from '../proto/spark_pb';

export interface HealthTitleProps {
    metadata: HealthMetadata;
}

export default function HealthTitle({ metadata }: HealthTitleProps) {
    const { user, generatedTime } = metadata;

    const [timeStr, dateStr] = formatDate(generatedTime);
    const showAvatar =
        user &&
        metadata.platform?.name !== 'Hytale' &&
        metadata.platform?.type !== PlatformMetadata_Type.APPLICATION;

    return (
        <div className="textbox title">
            <Head>
                <title>
                    Health Report @ {timeStr} {dateStr} | spark
                </title>
            </Head>
            <span>
                Health Report created by {showAvatar && <Avatar user={user} />}
                {user?.name} @ {timeStr} {dateStr}
            </span>
        </div>
    );
}
