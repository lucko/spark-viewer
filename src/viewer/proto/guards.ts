import {
    HeapData,
    HeapMetadata,
    SamplerData,
    SamplerMetadata,
    StackTraceNode,
    ThreadNode,
} from './spark_pb';

export function isSamplerData(
    data: SamplerData | HeapData
): data is SamplerData {
    return 'threads' in data;
}

export function isHeapData(data: SamplerData | HeapData): data is HeapData {
    return 'entries' in data;
}

export function isSamplerMetadata(
    metadata: SamplerMetadata | HeapMetadata
): metadata is SamplerMetadata {
    return 'startTime' in metadata;
}

export function isHeapMetadata(
    metadata: SamplerMetadata | HeapMetadata
): metadata is HeapMetadata {
    return 'user' in metadata && !('startTime' in metadata);
}

export function isStackTraceNode(
    node: StackTraceNode | ThreadNode
): node is StackTraceNode {
    return 'className' in node;
}

export function isThreadNode(
    node: StackTraceNode | ThreadNode
): node is ThreadNode {
    return 'name' in node && !('className' in node);
}
