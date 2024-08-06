import {
    HealthMetadata,
    HeapMetadata,
    SamplerMetadata,
    StackTraceNode,
    ThreadNode,
} from './spark_pb';

export type SparkMetadata = SamplerMetadata | HeapMetadata | HealthMetadata;

export function isSamplerMetadata(
    metadata: SparkMetadata
): metadata is SamplerMetadata {
    return 'startTime' in metadata;
}

export type SamplerNode = StackTraceNode | ThreadNode;

export function isStackTraceNode(node: SamplerNode): node is StackTraceNode {
    return 'className' in node;
}

export function isThreadNode(node: SamplerNode): node is ThreadNode {
    return 'name' in node && !('className' in node);
}
