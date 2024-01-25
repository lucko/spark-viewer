import Bowser from 'bowser';
import {
    ClientConnect,
    ServerConnectResponse_State,
} from '../../proto/spark_pb';
import { ListenerResult } from './Listener';
import { LocalSocketClient, LocalSocketListener } from './LocalSocketClient';
import { PacketListener } from './Packet';

export class InitialisationTask {
    private readonly socket: LocalSocketClient;
    private readonly listener: LocalSocketListener;
    private readonly clientId: string;

    constructor(socket: LocalSocketClient, listener: LocalSocketListener) {
        this.socket = socket;
        this.listener = listener;
        this.clientId = `${randomString(4)}-${randomString(4)}`;
    }

    public async run() {
        this.socket.eventBus.register(this.onMessage.bind(this));
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
            this.socket.startKeepalive(this.listener.onPing).then(_ => {});
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
            this.socket.socket!.close();
            return ListenerResult.STOP_LISTENING;
        }

        throw new Error(`unknown state: ${msg.state}`);
    };
}

function randomString(len: number) {
    function dec2hex(dec: number) {
        return dec.toString(16).padStart(2, '0');
    }

    const arr = new Uint8Array((len || 40) / 2);
    crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join('');
}
