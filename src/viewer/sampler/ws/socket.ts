import {
    decode as base64Decode,
    encode as base64Encode,
} from 'base64-arraybuffer';
import Bowser from 'bowser';
import {
    ClientConnect,
    PacketWrapper,
    RawPacket,
    ServerConnectResponse_Settings,
    ServerConnectResponse_State,
    SocketChannelInfo,
} from '../../proto/spark_pb';
import { generateKeys, importPublicKey, Keys, loadKeys } from './keys';
import { EventBus, Listener, ListenerResult } from './listener';
import { randomString } from './util';

export interface SocketListener {
    onConnect(
        socket: SocketClient,
        settings: ServerConnectResponse_Settings,
        trusted: boolean,
        clientId: string,
        initialPayloadId: string | undefined
    ): void;

    onPing(latency: number): void;

    onClose(): void;
}

export type Packet = PacketWrapper['packet'];
export type PacketListener = Listener<Packet>;

export type PingCallback = (latency: number) => void;

export class SocketClient {
    static VERSION = 1;
    static HOST = 'spark-usersockets.lucko.me';

    static async connect(channel: SocketChannelInfo, listener: SocketListener) {
        const keys = (await loadKeys()) || (await generateKeys());
        const remotePublicKey = await importPublicKey(channel.publicKey, [
            'verify',
        ]);

        console.log('[WS] Loaded viewer keys and decoded remote public key');

        const url = `wss://${SocketClient.HOST}/${channel.channelId}`;
        const socket = new WebSocket(url);
        const client = new SocketClient(socket, keys, remotePublicKey);

        socket.onmessage = event => {
            client.onReceive(event.data);
        };

        socket.onopen = () => {
            console.log('[WS] Socket open, initialising connection...');
            new InitialisationTask(client, listener).run();
        };

        socket.onclose = e => {
            listener.onClose();
        };
    }

    readonly socket: WebSocket;
    private readonly keys: Keys;
    private readonly listeners: EventBus<Packet>;
    private readonly remotePublicKey: CryptoKey;
    private readonly localPublicKey: Promise<Uint8Array>;

    private keepaliveTask?: KeepaliveTask;

    constructor(socket: WebSocket, keys: Keys, remotePublicKey: CryptoKey) {
        this.socket = socket;
        this.keys = keys;
        this.listeners = new EventBus();
        this.remotePublicKey = remotePublicKey;
        this.localPublicKey = crypto.subtle
            .exportKey('spki', this.keys.publicKey)
            .then(buf => new Uint8Array(buf));
    }

    public registerListener(listener: PacketListener) {
        return this.listeners.register(listener);
    }

    public unregisterListener(listener: PacketListener) {
        this.listeners.unregister(listener);
    }

    public startKeepalive(pingCallback: PingCallback) {
        this.keepaliveTask = new KeepaliveTask(this, pingCallback);
    }

    public async send(packet: PacketWrapper['packet']) {
        const message = PacketWrapper.toBinary({ packet });

        // sign the message with the viewer private key
        const signature = new Uint8Array(
            await crypto.subtle.sign(
                'RSASSA-PKCS1-v1_5',
                this.keys.privateKey,
                message
            )
        );

        const publicKey = await this.localPublicKey;
        const buf = RawPacket.toBinary({
            version: SocketClient.VERSION,
            signature,
            message,
            publicKey,
        });

        this.socket.send(base64Encode(buf));
    }

    async onReceive(data: string) {
        const { version, signature, message } = RawPacket.fromBinary(
            new Uint8Array(base64Decode(data))
        );

        if (version !== SocketClient.VERSION) {
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
        this.listeners.dispatch(packet.packet);
    }
}

class InitialisationTask {
    private readonly socket: SocketClient;
    private readonly listener: SocketListener;
    private readonly clientId: string;

    constructor(socket: SocketClient, listener: SocketListener) {
        this.socket = socket;
        this.listener = listener;
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

    onMessage: PacketListener = packet => {
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
            this.socket.startKeepalive(this.listener.onPing);
            this.listener.onConnect(
                this.socket,
                msg.settings!,
                trusted,
                this.clientId,
                msg.lastPayloadId
            );
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
        this.socket.registerListener(this.onMessage.bind(this));
        this.timer = setInterval(this.task.bind(this), 20_000);

        this.task().then(_ => {});
    }

    onMessage: PacketListener = packet => {
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
