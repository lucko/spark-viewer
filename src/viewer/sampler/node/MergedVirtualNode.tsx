import { isThreadNode } from '../../proto/guards';
import {
    NodeDetails,
    StackTraceNodeWithId,
    ThreadNodeWithId,
} from '../../proto/nodes';
import SamplerData from '../SamplerData';
import BasicVirtualNode from './BasicVirtualNode';
import NodeAccumulator from './NodeAccumulator';
import VirtualNode from './VirtualNode';

export default class MergedVirtualNode implements VirtualNode {
    constructor(
        private readonly data: SamplerData,
        private readonly nodes: StackTraceNodeWithId[]
    ) {
        if (nodes.length === 0) {
            throw new Error('nodes length is 0');
        }
    }

    getId(): number | number[] {
        return this.nodes.length == 1
            ? this.nodes[0].id
            : this.nodes.map(node => node.id);
    }

    getDetails(): NodeDetails {
        const node = this.nodes[0];
        if (isThreadNode(node)) {
            return { type: 'thread', name: node.name };
        } else {
            return {
                type: 'stackTrace',
                className: node.className,
                methodName: node.methodName,
                parentLineNumber: node.parentLineNumber,
                lineNumber: node.lineNumber,
                methodDesc: node.methodDesc,
            };
        }
    }

    getTime(): number {
        return this.nodes.reduce((acc, current) => acc + current.time, 0);
    }

    getTimes(): number[] {
        if (this.nodes.length === 1) {
            return this.nodes[0].times;
        }

        const len = this.nodes[0].times.length;
        return this.nodes.reduce((acc, current) => {
            for (let i = 0; i < len; i++) {
                acc[i] = acc[i] + current.times[i];
            }
            return acc;
        }, new Array<number>(len).fill(0));
    }

    getChildren(): VirtualNode[] {
        if (this.nodes.length == 1) {
            return this.nodes[0].children.map(
                child => new MergedVirtualNode(this.data, [child])
            );
        }

        const acc = new NodeAccumulator();
        this.nodes
            .flatMap(node => node.children)
            .forEach(node => acc.addNode(node));

        return acc
            .build()
            .map(nodes => new MergedVirtualNode(this.data, nodes));
    }

    getParents(): VirtualNode[] {
        const stackNodes = new NodeAccumulator();
        const threadNodes: ThreadNodeWithId[] = [];
        this.nodes
            .map(node => this.data.bottomUp.getParent(node.id))
            .filter(id => id !== undefined)
            .map(id => this.data.nodes.getNode(id!))
            .forEach(node => {
                if (isThreadNode(node)) {
                    threadNodes.push(node);
                } else {
                    stackNodes.addNode(node);
                }
            });

        return [
            ...threadNodes.map(node => new BasicVirtualNode(this.data, node)),
            ...stackNodes
                .build()
                .map(nodes => new MergedVirtualNode(this.data, nodes)),
        ];
    }

    getSource(): string | undefined {
        for (const node of this.nodes) {
            const source = this.data.sources.getSource(node.id);
            if (source) {
                return source;
            }
        }
        return undefined;
    }
}
