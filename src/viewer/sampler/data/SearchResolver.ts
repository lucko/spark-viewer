import { isThreadNode } from '../../proto/guards';
import { NodeWithId } from '../../proto/nodes';
import SamplerData from '../SamplerData';

export default class SearchResolver {
    constructor(private readonly data: SamplerData) {}

    public resolveSearchQuery(query: string): Set<number> {
        const acc = new Set<number>();
        for (const node of this.data.nodes.threadNodes) {
            this.resolve(node, query, acc);
        }
        return acc;
    }

    private resolve(node: NodeWithId, query: string, acc: Set<number>) {
        if (!acc.has(node.id) && this.nodeMatchesQuery(query, node)) {
            acc.add(node.id);
            this.addAllChildren(node, acc);
            this.addAllParents(node, acc);
        }

        for (const child of node.children) {
            this.resolve(child, query, acc);
        }
    }

    private addAllChildren(node: NodeWithId, acc: Set<number>) {
        for (const child of node.children) {
            acc.add(node.id);
            this.addAllChildren(child, acc);
        }
    }

    private addAllParents(node: NodeWithId, acc: Set<number>) {
        for (const parent of this.data.bottomUp.getParents(node.id)) {
            acc.add(parent);
        }
    }

    private nodeMatchesQuery(query: string, node: NodeWithId) {
        if (isThreadNode(node)) {
            return node.name.toLowerCase().includes(query);
        } else {
            const source = this.data.sources.getSource(node.id);
            return (
                node.className.toLowerCase().includes(query) ||
                node.methodName.toLowerCase().includes(query) ||
                (source && source.toLowerCase().includes(query))
            );
        }
    }
}
