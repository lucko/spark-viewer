import { StackTraceNode, YarnMappings } from '../../../../proto/spark_pb';
import { MappingFunction, RawMappingsResult } from '../types';

export default class YarnMappingFunction implements MappingFunction {
    constructor(private readonly yarnMappings: YarnMappings) {}

    map(node: StackTraceNode): RawMappingsResult {
        const methodName = this.yarnMappings.methods[node.methodName];

        let className;
        let lambda = node.className.match(/^(.+)(\$\$Lambda.+)$/);
        if (lambda) {
            className =
                (this.yarnMappings.classes[lambda[1]] || lambda[1]) + lambda[2];
        } else {
            className = this.yarnMappings.classes[node.className];
        }

        return { className, methodName };
    }
}
