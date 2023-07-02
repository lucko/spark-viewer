import {
    CommandSenderMetadata,
    CommandSenderMetadata_Type,
} from '../../proto/spark_pb';

export interface AvatarProps {
    user: CommandSenderMetadata;
}

export default function Avatar({ user }: AvatarProps) {
    let avatarUrl;
    if (user.type === CommandSenderMetadata_Type.PLAYER) {
        const uuid = user.uniqueId.replace(/-/g, '');
        avatarUrl = 'https://crafthead.net/helm/' + uuid + '/24.png';
    } else {
        avatarUrl = 'https://crafthead.net/avatar/Console/24.png';
    }

    return <img src={avatarUrl} alt="" />;
}
