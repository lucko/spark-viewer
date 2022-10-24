import { StackTraceNode } from '../../../../proto/spark_pb';
import { MappingFunction, RawMappingsResult } from '../types';

export default class NoOpMappingFunction implements MappingFunction {
    static INSTANCE = new NoOpMappingFunction();

    constructor() {}

    map(node: StackTraceNode): RawMappingsResult {
        return {};
    }
}
