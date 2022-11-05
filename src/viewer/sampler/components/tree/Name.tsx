import { isThreadNode } from '../../../proto/guards';
import { ExtendedNode } from '../../../proto/nodes';
import { MappingsResolver } from '../../mappings/resolver';

export interface NameProps {
    node: ExtendedNode;
    mappings: MappingsResolver;
}

export default function Name({ node, mappings }: NameProps) {
    if (isThreadNode(node)) {
        return <>{node.name}</>;
    }

    const resolved = mappings.resolve(node);
    if (resolved.type === 'native') {
        return (
            <>
                <span className="native-part">{node.methodName}</span>
                <span className="package-part"> (native)</span>
            </>
        );
    }

    const {
        className,
        methodName,
        packageName,
        lambda,
        remappedClass,
        remappedMethod,
    } = resolved;

    return (
        <>
            {!!packageName && (
                <span className="package-part">{packageName}</span>
            )}
            {remappedClass ? (
                <span className="class-part remapped" title={node.className}>
                    {className}
                </span>
            ) : (
                <span className="class-part">{className}</span>
            )}
            {!!lambda && <span className="lambda-part">{lambda}</span>}.
            {remappedMethod ? (
                <span className="method-part remapped" title={node.methodName}>
                    {methodName}
                </span>
            ) : (
                <span className="method-part">{methodName}</span>
            )}
            ()
        </>
    );
}
