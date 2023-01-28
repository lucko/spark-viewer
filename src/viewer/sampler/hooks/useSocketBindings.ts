import { useCallback, useState } from 'react';
import { SamplerMetadata } from '../../proto/spark_pb';
import { ListenerResult } from '../ws/listener';
import { SocketClientHook } from './useSocketClient';
import useSocketListener from './useSocketListener';

export interface SocketBindingsProps {
    socket: SocketClientHook;
    fetchUpdatedData: (payloadId: string) => void;
    metadata: SamplerMetadata;
    setMetadata: (metadata: SamplerMetadata) => void;
}

export interface SocketBinding {
    socket: SocketClientHook;
    lastStatsUpdate?: number;
    lastSamplerUpdate?: number;
}

export default function useSocketBindings({
    socket,
    fetchUpdatedData,
    metadata,
    setMetadata,
}: SocketBindingsProps): SocketBinding {
    const [lastStatsUpdate, setLastStatsUpdate] = useState<number>();
    const [lastSamplerUpdate, setLastSamplerUpdate] = useState<number>();

    useSocketListener(
        socket.socket,
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

                if (packet.oneofKind === 'serverUpdateSampler') {
                    const payloadId = packet.serverUpdateSampler.payloadId;
                    fetchUpdatedData(payloadId);
                    setLastSamplerUpdate(Date.now());
                }

                return ListenerResult.KEEP_LISTENING;
            },
            [metadata, setMetadata, fetchUpdatedData]
        )
    );

    return {
        socket,
        lastStatsUpdate,
        lastSamplerUpdate,
    };
}
