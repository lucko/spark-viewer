import { NodeDetails, StackTraceNodeWithId } from '../../proto/nodes';
import SamplerData from '../SamplerData';
import { SourceThreadNode } from '../worker/SourceViewGenerator';
import MergedVirtualNode from './MergedVirtualNode';
import VirtualNode from './VirtualNode';

export default class SourceThreadVirtualNode implements VirtualNode {
    private children?: VirtualNode[];

    constructor(
        private readonly data: SamplerData,
        readonly node: SourceThreadNode
    ) {}

    getId(): number | number[] {
        return this.node.id;
    }

    getDetails(): NodeDetails {
        return { type: 'thread', name: this.node.name };
    }

    getTime(): number {
        return this.node.threadTime;
    }

    getTimes(): number[] {
        return this.node.threadTimes;
    }

    getChildren(): VirtualNode[] {
        if (this.children === undefined) {
            this.children = this.node.children.map(
                nodes =>
                    new MergedVirtualNode(
                        this.data,
                        nodes.map(
                            id =>
                                this.data.nodes.getNode(
                                    id
                                ) as StackTraceNodeWithId
                        )
                    )
            );
        }
        return this.children;
    }

    getParents(): VirtualNode[] {
        return [];
    }

    getSource(): string | undefined {
        return this.data.sources.getSource(this.node.id);
    }

    getSourceTime(): number {
        return this.node.sourceTime;
    }
}
