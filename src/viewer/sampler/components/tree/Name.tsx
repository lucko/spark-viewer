import {
    NodeDetails,
    StackTraceNodeDetails,
    ThreadNodeDetails,
} from '../../../proto/nodes';
import { MappingsResolver } from '../../mappings/resolver';

export interface NameProps<T extends NodeDetails> {
    details: T;
    mappings: MappingsResolver;
}

export default function Name({ details, mappings }: NameProps<NodeDetails>) {
    switch (details.type) {
        case 'thread':
            return <ThreadName details={details} mappings={mappings} />;
        case 'stackTrace': {
            return <StackTraceName details={details} mappings={mappings} />;
        }
    }
}

const ThreadName = ({ details, mappings }: NameProps<ThreadNodeDetails>) => {
    return <>{details.name}</>;
};

const StackTraceName = ({
    details,
    mappings,
}: NameProps<StackTraceNodeDetails>) => {
    const resolved = mappings.resolve(details);
    if (resolved.type === 'native') {
        return (
            <>
                <span className="native-part">{details.methodName}</span>
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
                <span className="class-part remapped" title={details.className}>
                    {className}
                </span>
            ) : (
                <span className="class-part">{className}</span>
            )}
            {!!lambda && <span className="lambda-part">{lambda}</span>}.
            {remappedMethod ? (
                <span
                    className="method-part remapped"
                    title={details.methodName}
                >
                    {methodName}
                </span>
            ) : (
                <span className="method-part">{methodName}</span>
            )}
            ()
        </>
    );
};
