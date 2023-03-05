import { isThreadNode } from '../../proto/guards';
import { NodeDetails, NodeWithId } from '../../proto/nodes';
import SamplerData from '../SamplerData';
import VirtualNode from './VirtualNode';

export default class BasicVirtualNode implements VirtualNode {
    private children?: VirtualNode[];

    constructor(
        private readonly data: SamplerData,
        private readonly node: NodeWithId,
        private readonly parent?: VirtualNode
    ) {}

    getId(): number | number[] {
        return this.node.id;
    }

    getDetails(): NodeDetails {
        if (isThreadNode(this.node)) {
            return { type: 'thread', name: this.node.name };
        } else {
            return {
                type: 'stackTrace',
                className: this.node.className,
                methodName: this.node.methodName,
                parentLineNumber: this.node.parentLineNumber,
                lineNumber: this.node.lineNumber,
                methodDesc: this.node.methodDesc,
            };
        }
    }

    getTime(): number {
        return this.node.time;
    }

    getTimes(): number[] {
        return this.node.times;
    }

    getChildren(): VirtualNode[] {
        if (this.children === undefined) {
            this.children = this.node.children.map(
                n => new BasicVirtualNode(this.data, n, this)
            );
        }
        return this.children;
    }

    getParents(): VirtualNode[] {
        return this.parent ? [this.parent] : [];
    }

    getSource(): string | undefined {
        return this.data.sources.getSource(this.node.id);
    }
}
