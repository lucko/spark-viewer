import { useEffect } from 'react';
import { Listener, SocketInterface } from '../ws/socket';

export default function useSocketListener(
    socket: SocketInterface | null,
    listener: Listener
) {
    useEffect(() => {
        if (!socket) return;
        return socket.registerListener(listener);
    }, [socket, listener]);
}
