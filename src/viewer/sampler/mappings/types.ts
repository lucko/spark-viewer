import { StackTraceNodeDetails } from '../../proto/nodes';

export interface RawMappingsResult {
    className?: string;
    methodName?: string;
}

export interface MappingFunction {
    map(node: StackTraceNodeDetails): RawMappingsResult;
}
