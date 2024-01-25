import { Listener, ListenerResult } from './Listener';

export class EventBus<E> {
    private readonly listeners: Listener<E>[] = [];

    public register(listener: Listener<E>) {
        this.listeners.push(listener);
        return () => this.unregister(listener);
    }

    public unregister(listener: Listener<E>) {
        const idx = this.listeners.indexOf(listener);
        if (idx >= 0) {
            this.listeners.splice(idx, 1);
        }
    }

    public dispatch(event: E) {
        const toRemove: number[] = [];
        this.listeners.forEach((listener, i) => {
            const resp = listener(event);
            if (resp === ListenerResult.STOP_LISTENING) {
                toRemove.unshift(i);
            }
        });
        toRemove.forEach(i => this.listeners.splice(i, 1));
    }
}
