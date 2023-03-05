import { NodeWithId } from '../../proto/nodes';
import NodeMap from './NodeMap';

/**
 * A bottom-up map of the input data.
 */
export default class BottomUpMap {
    private readonly view: number[];

    constructor(nodes: NodeMap) {
        this.view = new Array(nodes.allNodes.length);

        const visit = (node: NodeWithId) => {
            for (const child of node.children) {
                this.view[child.id] = node.id;
                visit(child);
            }
        };

        for (let threadNode of nodes.threadNodes) {
            visit(threadNode);
        }
    }

    /**
     * Gets the parent of a given node
     * @param id the id of the node
     * @return the id of the nodes parent
     */
    public getParent(id: number): number | undefined {
        return this.view[id];
    }

    /**
     * Gets the parents of a given node
     * @param id the id of the node
     * @return the ids of the nodes parents
     */
    public getParents(id: number): number[] {
        const parentIds: number[] = [];

        let next = id;
        while (next !== undefined) {
            const parent = this.getParent(next);
            if (parent === undefined) {
                break;
            }

            parentIds.push(parent);
            next = parent;
        }

        return parentIds;
    }

    public traverseParents(ids: number[]): Set<number> {
        const resolved = new Set<number>();

        for (const id of ids) {
            resolved.add(id);
            for (const parent of this.getParents(id)) {
                resolved.add(parent);
            }
        }

        return resolved;
    }
}
