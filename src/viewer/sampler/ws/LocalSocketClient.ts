import {
    ServerConnectResponse_Settings,
    SocketChannelInfo,
} from '../../proto/spark_pb';
import { EventBus } from './EventBus';
import { InitialisationTask } from './InitialisationTask';
import type { PingCallback } from './KeepaliveTask';
import { generateKeys, importPublicKey, loadKeys } from './Keys';
import { decodePacket, encodePacket, Packet } from './Packet';
import RemoteSocketClient from './RemoteSocketClient';

export interface LocalSocketListener {
    onConnect(
        socket: LocalSocketClient,
        settings: ServerConnectResponse_Settings,
        trusted: boolean,
        clientId: string,
        initialPayloadId: string | undefined
    ): void;

    onPing(latency: number): void;

    onClose(): void;
}

export class LocalSocketClient {
    static async connect(
        channel: SocketChannelInfo,
        listener: LocalSocketListener
    ) {
        const keys = (await loadKeys()) || (await generateKeys());
        const remotePublicKey = await importPublicKey(channel.publicKey, [
            'verify',
        ]);

        console.log('[WS] Loaded viewer keys and decoded remote public key');

        const client = new LocalSocketClient();
        const socket = await RemoteSocketClient.connect(
            channel.channelId,
            {
                remotePublicKey: remotePublicKey,
                localPublicKey: keys.publicKey,
                localPrivateKey: keys.privateKey,
            },
            {
                onclose: () => {
                    listener.onClose();
                },
                onopen: () => {
                    console.log('[WS] Socket open, initialising connection...');
                    new InitialisationTask(client, listener).run();
                },
                onmessage: e => {
                    client.onReceive(e);
                },
                onerror: () => {},
            }
        );
        client.setSocket(socket);
    }

    socket?: RemoteSocketClient;

    public readonly eventBus: EventBus<Packet>;

    constructor() {
        this.eventBus = new EventBus();
    }

    public setSocket(socket: RemoteSocketClient) {
        this.socket = socket;
    }

    public async startKeepalive(pingCallback: PingCallback) {
        await this.socket!.startKeepalive(pingCallback);
    }

    public async send(packet: Packet) {
        await this.socket!.send(encodePacket(packet));
    }

    async onReceive(message: Uint8Array) {
        this.eventBus.dispatch(decodePacket(message));
    }
}
