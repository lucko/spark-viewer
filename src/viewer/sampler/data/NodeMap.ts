import type {
    NodeWithId,
    StackTraceNodeWithId,
    ThreadNodeWithId,
} from '../../proto/nodes';
import type { ThreadNode } from '../../proto/spark_pb';

export default class NodeMap {
    readonly allNodes: NodeWithId[];
    readonly threadNodes: ThreadNodeWithId[];
    readonly stackTraceNodes: StackTraceNodeWithId[];

    constructor(input: ThreadNode[]) {
        const castedInput = input as ThreadNodeWithId[];

        const builder = new ArrayBuilder<NodeWithId>();
        const lastThreadId = assign(castedInput, builder);
        const nodes = builder.build();

        this.allNodes = nodes;
        this.threadNodes = nodes.slice(
            0,
            lastThreadId + 1
        ) as ThreadNodeWithId[];
        this.stackTraceNodes = nodes.slice(
            lastThreadId + 1,
            nodes.length
        ) as StackTraceNodeWithId[];
    }

    public getNode(id: number): NodeWithId {
        return this.allNodes[id];
    }
}

/**
 * Assigns an id to each node in the input recursively using the array builder.
 *
 * @param nodes the input nodes
 * @param builder the array builder to add each node to. responsible for generating the id
 * @return the id/index assigned to the last node at the top level array, before recursion
 */
function assign(
    nodes: NodeWithId[],
    builder: ArrayBuilder<NodeWithId>
): number {
    for (const node of nodes) {
        node.id = builder.add(node);
    }
    const last = builder.prev();
    for (const n of nodes) {
        if (n.children) {
            assign(n.children, builder);
        }
    }
    return last;
}

/**
 * Builds an array of things
 */
class ArrayBuilder<T> {
    private readonly arr: Array<T>;

    constructor() {
        this.arr = [];
    }

    /**
     * Gets the index of the previously added value
     */
    public prev(): number {
        return this.next() - 1;
    }

    /**
     * Gets the index that will be assigned to the next value added
     */
    public next(): number {
        return this.arr.length;
    }

    /**
     * Adds a value to the array, and returns its index
     *
     * @param val the value to add
     */
    public add(val: T): number {
        this.arr.push(val);
        return this.arr.length - 1;
    }

    public build(): Array<T> {
        return this.arr;
    }
}
