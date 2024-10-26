import {
    decode as base64Decode,
    encode as base64Encode,
} from 'base64-arraybuffer';
import { expose, transfer } from 'comlink';
import { RawPacket } from '../../proto/spark_pb';
import { EventBus } from './EventBus';
import { KeepaliveTask, PingCallback } from './KeepaliveTask';

export interface AsyncWebSocketListeners {
    onclose: () => any;
    onerror: () => any;
    onmessage: (data: Uint8Array) => any;
    onopen: () => any;
}

export interface SocketKeys {
    remotePublicKey: CryptoKey;
    localPublicKey: CryptoKey;
    localPrivateKey: CryptoKey;
}

export class SocketClient {
    static VERSION = 1;
    static HOST = 'usersockets.spark.1l1.icu';

    private readonly remotePublicKey: CryptoKey;
    private readonly localPublicKey: Promise<Uint8Array>;
    private readonly localPrivateKey: CryptoKey;

    private readonly listeners: AsyncWebSocketListeners;
    readonly eventBus = new EventBus<Uint8Array>();
    private readonly socket: WebSocket;

    constructor(
        channelId: string,
        keys: SocketKeys,
        listeners: AsyncWebSocketListeners
    ) {
        this.remotePublicKey = keys.remotePublicKey;
        this.localPublicKey = crypto.subtle
            .exportKey('spki', keys.localPublicKey)
            .then(buf => new Uint8Array(buf));
        this.localPrivateKey = keys.localPrivateKey;

        this.listeners = listeners;

        console.log('[WS] Creating websocket connection');
        this.socket = new WebSocket(`wss://${SocketClient.HOST}/${channelId}`);
        this.socket.onclose = this.onclose.bind(this);
        this.socket.onerror = this.onerror.bind(this);
        this.socket.onmessage = this.onmessage.bind(this);
        this.socket.onopen = this.onopen.bind(this);
    }

    async onclose(e: CloseEvent) {
        this.listeners.onclose();
    }

    async onerror(e: Event) {
        this.listeners.onerror();
    }

    async onmessage(e: MessageEvent<any>) {
        const buf = new Uint8Array(base64Decode(e.data));

        const { version, signature, message } = RawPacket.fromBinary(buf);

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

        this.eventBus.dispatch(message);
        this.listeners.onmessage(transfer(message, [message.buffer]));
    }

    async onopen(e: Event) {
        this.listeners.onopen();
    }

    public async send(message: Uint8Array) {
        // sign the message with the viewer private key
        const signature = new Uint8Array(
            await crypto.subtle.sign(
                'RSASSA-PKCS1-v1_5',
                this.localPrivateKey,
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

    public readyState(): number {
        return this.socket.readyState;
    }

    public startKeepalive(callback: PingCallback) {
        new KeepaliveTask(this, callback);
    }

    public close() {
        this.socket.close();
    }
}

expose(SocketClient);
