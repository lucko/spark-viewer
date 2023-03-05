import { StackTraceNodeDetails } from '../../../proto/nodes';
import { McpMappings } from '../../../proto/spark_pb';
import { MappingFunction, RawMappingsResult } from '../types';

export default class McpMappingFunction implements MappingFunction {
    constructor(private readonly mcpMappings: McpMappings) {}

    map(node: StackTraceNodeDetails): RawMappingsResult {
        const methodName = this.mcpMappings.methods[node.methodName];
        return { methodName };
    }
}
