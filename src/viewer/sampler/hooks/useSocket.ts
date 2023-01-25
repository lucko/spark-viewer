import { useEffect, useState } from 'react';
import { LiveChannelInfo } from '../../proto/spark_pb';
import { SocketInterface } from '../ws/socket';

type SocketHook = [SocketInterface | null, number | undefined];

export default function useSocket(channelInfo?: LiveChannelInfo): SocketHook {
    const [initialized, setInitialized] = useState(false);
    const [socket, setSocket] = useState<SocketInterface | null>(null);
    const [socketLatency, setSocketLatency] = useState<number>();

    useEffect(() => {
        if (!channelInfo || initialized) {
            return;
        }
        setInitialized(true);

        (async () => {
            await SocketInterface.connect(channelInfo, {
                onConnect(
                    socket: SocketInterface,
                    trusted: boolean,
                    clientId: string
                ) {
                    setSocket(socket);
                },
                onPing(latency: number) {
                    setSocketLatency(latency);
                },
                onClose() {
                    setSocket(null);
                    setInitialized(false);
                },
            });
        })();
    }, [channelInfo, initialized]);

    /*
    useSocketListener(
        socket,
        packet => {
            if (packet.oneofKind === 'serverPong') {
                return ListenerResult.KEEP_LISTENING;
            }
            console.log(new Date().toLocaleTimeString(), packet.oneofKind);
            return ListenerResult.KEEP_LISTENING;
        },
        []
    );
    */

    return [socket, socketLatency];
}
