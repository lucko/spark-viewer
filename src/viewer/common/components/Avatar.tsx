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
        avatarUrl = 'https://crafthead.net/helm/' + uuid + '/20.png';
    } else {
        avatarUrl = 'https://crafthead.net/avatar/Console/20.png';
    }

    return <img src={avatarUrl} alt="" />;
}
