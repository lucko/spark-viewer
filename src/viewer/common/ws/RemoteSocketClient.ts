import { proxy, releaseProxy, Remote, transfer, wrap } from 'comlink';
import { PingCallback } from './KeepaliveTask';
import type {
    AsyncWebSocketListeners,
    SocketClient,
    SocketKeys,
} from './SocketClient';

function createListenerProxy(
    listeners: AsyncWebSocketListeners
): AsyncWebSocketListeners {
    return proxy({
        onclose: proxy(listeners.onclose),
        onerror: proxy(listeners.onerror),
        onmessage: proxy(listeners.onmessage),
        onopen: proxy(listeners.onopen),
    });
}

export default class RemoteSocketClient {
    static async connect(
        channelId: string,
        keys: SocketKeys,
        listeners: AsyncWebSocketListeners
    ): Promise<RemoteSocketClient> {
        console.log('[WS] Creating remote socket client');
        const worker = new Worker(
            new URL('./SocketClient.ts', import.meta.url)
        );
        const AsyncWebSocket = wrap<SocketClient>(worker) as any;
        const proxy = (await new AsyncWebSocket(
            channelId,
            keys,
            createListenerProxy(listeners)
        )) as Remote<SocketClient>;
        return new RemoteSocketClient(proxy);
    }

    constructor(private readonly proxy: Remote<SocketClient>) {}

    public async send(buf: Uint8Array): Promise<void> {
        await this.proxy.send(transfer(buf, [buf.buffer]));
    }

    public async startKeepalive(callback: PingCallback) {
        await this.proxy.startKeepalive(proxy(callback));
    }

    public async close() {
        await this.proxy.close();
        this.proxy[releaseProxy]();
    }
}
