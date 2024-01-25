import { useCallback, useEffect, useState } from 'react';
import {
    ServerConnectResponse_Settings,
    SocketChannelInfo,
} from '../../proto/spark_pb';
import { LocalSocketClient } from '../ws/LocalSocketClient';

export interface SocketClientHook {
    socket?: LocalSocketClient;
    clientId?: string;
    trusted: boolean;
    settings?: ServerConnectResponse_Settings;
    latency?: number;
}

export default function useSocketClient(
    channelInfo: SocketChannelInfo | undefined,
    initialPayloadCallback: (payloadId: string) => void
): SocketClientHook {
    const [initialized, setInitialized] = useState(false);
    const [socket, setSocket] = useState<LocalSocketClient>();
    const [clientId, setClientId] = useState<string>();
    const [trusted, setTrusted] = useState<boolean>(false);
    const [settings, setSettings] = useState<ServerConnectResponse_Settings>();
    const [latency, setLatency] = useState<number>();

    const init = useCallback(
        async (channelInfo: SocketChannelInfo) => {
            await LocalSocketClient.connect(channelInfo, {
                onConnect(
                    socket: LocalSocketClient,
                    settings: ServerConnectResponse_Settings,
                    trusted: boolean,
                    clientId: string,
                    initialPayloadId: string
                ) {
                    setSocket(socket);
                    setClientId(clientId);
                    setTrusted(trusted);
                    setSettings(settings);

                    if (initialPayloadId) {
                        initialPayloadCallback(initialPayloadId);
                    }
                },
                onPing(latency: number) {
                    setLatency(latency);
                },
                onClose() {
                    setSocket(undefined);
                },
            });
        },
        [initialPayloadCallback]
    );

    useEffect(() => {
        if (!channelInfo || initialized) {
            return;
        }
        setInitialized(true);

        init(channelInfo).catch(err => {
            console.log('Error initialising the socket', err);
        });
    }, [channelInfo, initialized, init]);

    return { socket, clientId, trusted, settings, latency };
}
