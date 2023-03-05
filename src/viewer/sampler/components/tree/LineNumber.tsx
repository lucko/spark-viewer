import VirtualNode from '../../node/VirtualNode';

export interface LineNumberProps {
    node: VirtualNode;
    parent: VirtualNode | null;
}

export default function LineNumber({ node, parent }: LineNumberProps) {
    if (!parent) return null;

    const details = node.getDetails();
    if (details.type !== 'stackTrace' || !details.parentLineNumber) return null;

    const parentDetails = parent.getDetails();
    if (parentDetails.type !== 'stackTrace') return null;

    const title =
        'Invoked on line ' +
        details.parentLineNumber +
        ' of ' +
        parentDetails.className +
        '.' +
        parentDetails.methodName +
        '()';
    return (
        <span className="lineNumber" title={title}>
            :{details.parentLineNumber}
        </span>
    );
}
