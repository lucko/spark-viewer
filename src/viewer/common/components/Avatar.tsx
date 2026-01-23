import {
    CommandSenderMetadata,
    CommandSenderMetadata_Type,
    PlatformMetadata,
    PlatformMetadata_Type,
} from '../../proto/spark_pb';

export interface AvatarProps {
    user?: CommandSenderMetadata;
    platform?: PlatformMetadata;
}

export default function Avatar({ user, platform }: AvatarProps) {
    const showAvatar =
        user && platform?.type !== PlatformMetadata_Type.APPLICATION;

    if (!showAvatar) {
        return null;
    }

    let avatarUrl;
    if (user.type === CommandSenderMetadata_Type.PLAYER) {
        const uuid = user.uniqueId.replace(/-/g, '');
        avatarUrl =
            platform?.name === 'Hytale'
                ? 'https://crafthead.net/hytale/helm/' + uuid + '/24.png'
                : 'https://crafthead.net/helm/' + uuid + '/24.png';
    } else {
        avatarUrl = 'https://crafthead.net/avatar/Console/24.png';
    }

    return <img src={avatarUrl} alt="" />;
}
