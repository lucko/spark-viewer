import { StackTraceNodeDetails } from '../../../proto/nodes';
import { MappingFunction, RawMappingsResult } from '../types';

export default class NoOpMappingFunction implements MappingFunction {
    static INSTANCE = new NoOpMappingFunction();

    constructor() {}

    map(node: StackTraceNodeDetails): RawMappingsResult {
        return {};
    }
}
