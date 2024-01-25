import { Listener, ListenerResult } from './Listener';
import { decodePacket, encodePacket } from './Packet';
import { SocketClient } from './SocketClient';

export type PingCallback = (latency: number) => void;

export class KeepaliveTask {
    private readonly socket: SocketClient;
    private readonly pingCallback: PingCallback;

    private readonly pings: Map<number, number>;
    private lastPing: number;
    private lastPong: number;
    private readonly timer?: ReturnType<typeof setInterval>;

    constructor(socket: SocketClient, pingCallback: PingCallback) {
        this.socket = socket;
        this.pingCallback = pingCallback;
        this.pings = new Map();
        this.lastPing = 0;
        this.lastPong = 0;
        this.socket.eventBus.register(this.onMessage.bind(this));
        this.timer = setInterval(this.task.bind(this), 20_000);

        this.task().then(_ => {});
    }

    onMessage: Listener<Uint8Array> = message => {
        const packet = decodePacket(message);
        if (packet.oneofKind === 'serverPong') {
            if (!packet.serverPong.ok) {
                console.log(
                    '[WS] Server closed the connection, disconnecting...'
                );
                this.socket.close();
                return ListenerResult.STOP_LISTENING;
            }

            const sentTime = this.pings.get(packet.serverPong.data);
            if (sentTime) {
                const time = Date.now();
                this.lastPong = time;
                this.pingCallback(time - sentTime);
                this.pings.delete(packet.serverPong.data);
            }
        }
        return ListenerResult.KEEP_LISTENING;
    };

    async task() {
        if (this.socket.readyState() !== 1) {
            clearInterval(this.timer);
            return;
        }

        if (this.lastPing !== 0 && Date.now() - this.lastPong > 45000) {
            console.log(
                '[WS] Server stopped responding to keepalive, disconnecting'
            );
            this.socket.close();
            return;
        }

        const pingId = Math.floor(Math.random() * 100000000);
        const time = Date.now();

        this.lastPing = time;
        this.pings.set(pingId, time);

        await this.socket.send(
            encodePacket({
                oneofKind: 'clientPing',
                clientPing: {
                    ok: true,
                    data: pingId,
                },
            })
        );
    }
}
