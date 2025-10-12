import { StackTraceNodeDetails } from '../../../proto/nodes';
import { MojangMappings } from '../../../proto/spark_pb';
import { MappingFunction, RawMappingsResult } from '../types';

export default class VanillaMappingFunction implements MappingFunction {
    constructor(private readonly mojangMappings: MojangMappings) {}

    map(node: StackTraceNodeDetails): RawMappingsResult {
        const lambda = node.className.match(/^(.+)(\$\$Lambda.+)$/);
        const clazz = lambda
            ? this.mojangMappings.classes[lambda[1]]
            : this.mojangMappings.classes[node.className];

        if (!clazz) {
            return {};
        }

        const className = clazz.mapped + (lambda ? lambda[2] : '');
        const methods = clazz.methods.filter(
            m => m.obfuscated === node.methodName
        );

        let methodName: string | undefined = undefined;
        if (methods.length === 1) {
            methodName = methods[0].mapped;
        } else if (methods.length > 1) {
            const method = methods.find(m => m.description === node.methodDesc);
            if (method) {
                methodName = method.mapped;
            }
        }

        return { className, methodName };
    }
}
