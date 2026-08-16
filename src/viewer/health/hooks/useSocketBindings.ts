import { useCallback, useState } from 'react';
import { SocketClientHook } from '../../common/hooks/useSocketClient';
import useSocketListener from '../../common/hooks/useSocketListener';
import { ListenerResult } from '../../common/ws/Listener';
import { HealthMetadata, PlatformStatistics } from '../../proto/spark_pb';

export interface SocketBindingsProps {
    socket: SocketClientHook;
    fetchUpdatedData: (payloadId: string) => void;
    metadata: HealthMetadata;
    setMetadata: (metadata: HealthMetadata) => void;
}

export interface SocketBinding {
    socket: SocketClientHook;
    lastStatsUpdate?: number;
}

export default function useSocketBindings({
    socket,
    fetchUpdatedData,
    metadata,
    setMetadata,
}: SocketBindingsProps): SocketBinding {
    const [lastStatsUpdate, setLastStatsUpdate] = useState<number>();

    useSocketListener(
        socket.socket,
        useCallback(
            packet => {
                if (packet.oneofKind === 'serverUpdateStatistics') {
                    const { platform, system, metrics } =
                        packet.serverUpdateStatistics;

                    const platformWithWorld = {
                        ...platform,
                        world: metadata.platformStatistics?.world,
                    } as PlatformStatistics;

                    const newMetadata: HealthMetadata = {
                        ...metadata,
                        platformStatistics: platformWithWorld,
                        systemStatistics: system,
                        metrics: metrics,
                    };
                    setMetadata(newMetadata);
                    setLastStatsUpdate(Date.now());
                }

                return ListenerResult.KEEP_LISTENING;
            },
            [metadata, setMetadata, fetchUpdatedData]
        )
    );

    return {
        socket,
        lastStatsUpdate,
    };
}
