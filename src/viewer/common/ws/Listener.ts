export type Listener<E> = (event: E) => ListenerResult;

export enum ListenerResult {
    KEEP_LISTENING,
    STOP_LISTENING,
}
