import {
    decode as base64Decode,
    encode as base64Encode,
} from 'base64-arraybuffer';
import Bowser from 'bowser';
import {
    ClientConnect,
    LiveChannelInfo,
    PacketWrapper,
    RawPacket,
    ServerConnectResponse_State,
} from '../../proto/spark_pb';
import { generateKeys, importPublicKey, Keys, loadKeys } from './keys';
import { randomString } from './util';

const bytesocksHost = 'usersockets.luckperms.net'; // TODO

export interface SocketCallbacks {
    onConnect(
        socket: SocketInterface,
        trusted: boolean,
        clientId: string
    ): void;

    onPing(latency: number): void;

    onClose(): void;
}

export type Listener = (packet: PacketWrapper['packet']) => ListenerResult;

export enum ListenerResult {
    KEEP_LISTENING,
    STOP_LISTENING,
}

export class SocketInterface {
    static async connect(channel: LiveChannelInfo, callbacks: SocketCallbacks) {
        const keys = (await loadKeys()) || (await generateKeys());
        const remotePublicKey = await importPublicKey(channel.publicKey, [
            'verify',
        ]);

        console.log('[WS] Loaded viewer keys and decoded remote public key');

        const socket = new WebSocket(
            `wss://${bytesocksHost}/${channel.channelId}`
        );
        const socketInterface = new SocketInterface(
            socket,
            keys,
            remotePublicKey
        );

        socket.onmessage = event => {
            socketInterface.onReceive(event.data);
        };

        socket.onopen = () => {
            console.log('[WS] Socket open, initialising connection...');
            new InitialisationTask(socketInterface, callbacks).run();
        };

        socket.onclose = e => {
            callbacks.onClose();
        };
    }

    readonly socket: WebSocket;

    private readonly keys: Keys;
    private readonly remotePublicKey: CryptoKey;
    private readonly listeners: Listener[];

    private keepaliveTask?: KeepaliveTask;

    constructor(socket: WebSocket, keys: Keys, remotePublicKey: CryptoKey) {
        this.socket = socket;
        this.keys = keys;
        this.remotePublicKey = remotePublicKey;
        this.listeners = [];
    }

    public async send(packet: PacketWrapper['packet']) {
        const message = PacketWrapper.toBinary({ packet });

        // sign the message with the viewer private key
        const publicKey = await crypto.subtle.exportKey(
            'spki',
            this.keys.publicKey
        );
        const signature = await crypto.subtle.sign(
            'RSASSA-PKCS1-v1_5',
            this.keys.privateKey,
            message
        );

        const buf = RawPacket.toBinary({
            version: 1,
            signature: new Uint8Array(signature),
            message: message,
            publicKey: new Uint8Array(publicKey),
        });

        this.socket.send(base64Encode(buf));
    }

    public registerListener(listener: Listener) {
        this.listeners.push(listener);
        return () => this.unregisterListener(listener);
    }

    public unregisterListener(listener: Listener) {
        const idx = this.listeners.indexOf(listener);
        if (idx >= 0) {
            this.listeners.splice(idx, 1);
        }
    }

    public startKeepalive(pingCallback: (latency: number) => void) {
        this.keepaliveTask = new KeepaliveTask(this, pingCallback);
    }

    async onReceive(data: string) {
        const { version, signature, message } = RawPacket.fromBinary(
            new Uint8Array(base64Decode(data))
        );

        if (version !== 1) {
            throw new Error(`Unexpected version: ${version}`);
        }

        const verified = await crypto.subtle.verify(
            'RSASSA-PKCS1-v1_5',
            this.remotePublicKey,
            signature,
            message
        );

        if (!verified) {
            return;
        }

        const packet = PacketWrapper.fromBinary(message);

        const toRemove: number[] = [];
        this.listeners.forEach((listener, i) => {
            const resp = listener(packet.packet);
            if (resp === ListenerResult.STOP_LISTENING) {
                toRemove.unshift(i);
            }
        });
        toRemove.forEach(i => this.listeners.splice(i, 1));
    }
}

class InitialisationTask {
    private readonly socket: SocketInterface;
    private readonly callbacks: SocketCallbacks;
    private readonly clientId: string;

    constructor(socket: SocketInterface, callbacks: SocketCallbacks) {
        this.socket = socket;
        this.callbacks = callbacks;
        this.clientId = `${randomString(4)}-${randomString(4)}`;
    }

    public async run() {
        this.socket.registerListener(this.onMessage.bind(this));
        await this.sendClientConnect();
    }

    private async sendClientConnect() {
        const { browser, os } = Bowser.parse(window.navigator.userAgent);

        const packet: ClientConnect = {
            clientId: this.clientId,
            description: `${browser.name} on ${os.name}`,
        };

        // send a client connect packet once the socket is ready
        await this.socket.send({
            oneofKind: 'clientConnect',
            clientConnect: packet,
        });
    }

    onMessage: Listener = packet => {
        if (packet.oneofKind !== 'serverConnectResponse') {
            return ListenerResult.KEEP_LISTENING;
        }

        const msg = packet.serverConnectResponse;
        if (msg.clientId !== this.clientId) {
            return ListenerResult.KEEP_LISTENING;
        }

        if (
            msg.state === ServerConnectResponse_State.ACCEPTED ||
            msg.state === ServerConnectResponse_State.UNTRUSTED
        ) {
            const trusted = msg.state === ServerConnectResponse_State.ACCEPTED;
            console.log(
                `[WS] Established connection with server (${
                    trusted ? 'trusted' : 'untrusted'
                })`
            );
            this.socket.startKeepalive(this.callbacks.onPing);
            this.callbacks.onConnect(this.socket, trusted, this.clientId);
            return trusted
                ? ListenerResult.STOP_LISTENING
                : ListenerResult.KEEP_LISTENING;
        }

        if (msg.state === ServerConnectResponse_State.REJECTED) {
            console.log('[WS] Rejected by server, disconnecting.');
            this.socket.socket.close();
            return ListenerResult.STOP_LISTENING;
        }

        throw new Error(`unknown state: ${msg.state}`);
    };
}

class KeepaliveTask {
    private readonly socket: SocketInterface;
    private readonly pingCallback: (latency: number) => void;

    private readonly pings: Map<number, number>;
    private lastPing: number;
    private lastPong: number;
    private readonly timer?: ReturnType<typeof setInterval>;

    constructor(
        socket: SocketInterface,
        pingCallback: (latency: number) => void
    ) {
        this.socket = socket;
        this.pingCallback = pingCallback;
        this.pings = new Map();
        this.lastPing = 0;
        this.lastPong = 0;
        this.socket.registerListener(this.onMessage.bind(this));
        this.timer = setInterval(this.task.bind(this), 20_000);

        this.task().then(_ => {});
    }

    onMessage: Listener = packet => {
        if (packet.oneofKind === 'serverPong') {
            if (!packet.serverPong.ok) {
                console.log(
                    '[WS] Server closed the connection, disconnecting...'
                );
                this.socket.socket.close();
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
        if (this.socket.socket.readyState !== 1) {
            clearInterval(this.timer);
            return;
        }

        if (this.lastPing !== 0 && Date.now() - this.lastPong > 45000) {
            console.log(
                '[WS] Server stopped responding to keepalive, disconnecting'
            );
            this.socket.socket.close();
            return;
        }

        const pingId = Math.floor(Math.random() * 100000000);
        const time = Date.now();

        this.lastPing = time;
        this.pings.set(pingId, time);

        await this.socket.send({
            oneofKind: 'clientPing',
            clientPing: {
                ok: true,
                data: pingId,
            },
        });
    }
}
