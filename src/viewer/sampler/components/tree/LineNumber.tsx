import { StackTraceNode } from '../../../proto/spark_pb';

export interface LineNumberProps {
    node: StackTraceNode;
    parent: StackTraceNode;
}

export default function LineNumber({ node, parent }: LineNumberProps) {
    const title =
        'Invoked on line ' +
        node.parentLineNumber +
        ' of ' +
        parent.className +
        '.' +
        parent.methodName +
        '()';
    return (
        <span className="lineNumber" title={title}>
            :{node.parentLineNumber}
        </span>
    );
}
