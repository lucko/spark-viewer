import { useCallback, useState } from 'react';
import { SamplerMetadata } from '../../proto/spark_pb';
import { ListenerResult, SocketInterface } from '../ws/socket';
import useSocketListener from './useSocketListener';

export interface SocketBindingsProps {
    socket: SocketInterface | null;
    metadata: SamplerMetadata;
    setMetadata: (metadata: SamplerMetadata) => void;
}

export interface SocketBinding {
    lastStatsUpdate: number;
}

export default function useSocketBindings({
    socket,
    metadata,
    setMetadata,
}: SocketBindingsProps): SocketBinding {
    const [lastStatsUpdate, setLastStatsUpdate] = useState(0);

    useSocketListener(
        socket,
        useCallback(
            packet => {
                if (packet.oneofKind === 'serverUpdateStatistics') {
                    const { platform, system } = packet.serverUpdateStatistics;
                    const newMetadata: SamplerMetadata = {
                        ...metadata,
                        platformStatistics: platform,
                        systemStatistics: system,
                    };
                    setMetadata(newMetadata);
                    setLastStatsUpdate(Date.now());
                }

                return ListenerResult.KEEP_LISTENING;
            },
            [metadata, setMetadata]
        )
    );

    return {
        lastStatsUpdate,
    };
}
