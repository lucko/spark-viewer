import { NodeDetails, StackTraceNodeWithId } from '../../proto/nodes';
import SamplerData from '../SamplerData';
import { FlatThreadNode } from '../worker/FlatViewGenerator';
import MergedVirtualNode from './MergedVirtualNode';
import VirtualNode from './VirtualNode';

export default class FlatThreadVirtualNode implements VirtualNode {
    private children?: VirtualNode[];

    constructor(
        private readonly data: SamplerData,
        readonly node: FlatThreadNode
    ) {}

    getId(): number | number[] {
        return this.node.id;
    }

    getDetails(): NodeDetails {
        return { type: 'thread', name: this.node.name };
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
}
