import { StackTraceNode } from '../../proto/spark_pb';
import { MappingFunction } from './types';

/**
 * Resolves mappings results for a given node in the stack tree.
 */
export class MappingsResolver {
    constructor(private readonly mappingFunction: MappingFunction) {}

    public resolve(node: StackTraceNode): ResolvedMappingsResult {
        // the node's className is native, it is a native stack frame
        // so can be rendered accordingly.
        if (node.className === 'native') {
            return { type: 'native' };
        }

        let { className, methodName } = this.mappingFunction.map(node) || {};

        const remappedClass = !!className;
        const remappedMethod = !!methodName;

        className = className || node.className;
        methodName = methodName || node.methodName;

        let lambda;
        let packageName;

        // separate out lambda description
        let i = className.indexOf('$$Lambda');
        if (i !== -1) {
            lambda = className.substring(i);
            className = className.substring(0, i);
        }

        // separate out package name
        i = className.lastIndexOf('.');
        if (i !== -1) {
            packageName = className.substring(0, i + 1);
            className = className.substring(i + 1);
        }

        return {
            type: 'normal',
            className,
            methodName,
            packageName,
            lambda,
            remappedClass,
            remappedMethod,
        };
    }
}

/**
 * Detected that the stack trace node was a native call, so unable to apply mappings.
 */
interface ResolvedMappingsResultNative {
    type: 'native';
}

/**
 * Normal java method call, so mappings results are included.
 */
interface ResolvedMappingsResultNormal {
    type: 'normal';

    /** The possibly remapped name of the class */
    className: string;
    /** The possibly remapped name of the method */
    methodName: string;
    /** The name of the package */
    packageName?: string;
    /** The lambda description component of the stack, if any (comes after the className) */
    lambda?: string;
    /** If the className was remapped */
    remappedClass: boolean;
    /** If the methodName was remapped */
    remappedMethod: boolean;
}

export type ResolvedMappingsResult =
    | ResolvedMappingsResultNative
    | ResolvedMappingsResultNormal;
