import { StackTraceNode } from '../../proto/spark_pb';

export interface RawMappingsResult {
    className?: string;
    methodName?: string;
}

export interface MappingFunction {
    map(node: StackTraceNode): RawMappingsResult;
}
