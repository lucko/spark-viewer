import { useEffect } from 'react';
import { LocalSocketClient } from '../ws/LocalSocketClient';
import { PacketListener } from '../ws/Packet';

export default function useSocketListener(
    socket: LocalSocketClient | undefined,
    listener: PacketListener
) {
    useEffect(() => {
        if (!socket) return;
        return socket.eventBus.register(listener);
    }, [socket, listener]);
}
