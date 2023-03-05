import { StackTraceNodeWithId } from '../../proto/nodes';
import { StackTraceNode } from '../../proto/spark_pb';

export default class NodeAccumulator {
    private readonly map: Map<string, StackTraceNodeWithId[]>;

    constructor() {
        this.map = new Map();
    }

    public addNode(node: StackTraceNodeWithId) {
        const key = NodeAccumulator.keyForNode(node);

        let ids = this.map.get(key);
        if (ids === undefined) {
            ids = [];
            this.map.set(key, ids);
        }

        ids.push(node);
    }

    public build(): StackTraceNodeWithId[][] {
        return Array.from(this.map.values());
    }

    public static keyForNode(node: StackTraceNode) {
        return `${node.className}\0${node.methodName}\0${node.methodDesc}`;
    }
}
