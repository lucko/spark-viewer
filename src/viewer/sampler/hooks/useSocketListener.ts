import { useEffect } from 'react';
import { PacketListener, SocketClient } from '../ws/socket';

export default function useSocketListener(
    socket: SocketClient | undefined,
    listener: PacketListener
) {
    useEffect(() => {
        if (!socket) return;
        return socket.registerListener(listener);
    }, [socket, listener]);
}
