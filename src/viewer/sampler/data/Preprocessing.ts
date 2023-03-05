import { Node } from '../../proto/nodes';
import { StackTraceNode, ThreadNode } from '../../proto/spark_pb';

export default class Preprocessing {
    static unflatten(threadNodes: ThreadNode[]) {
        const visit = (nodes: Node[], flatArray: StackTraceNode[]) => {
            for (const node of nodes) {
                const arr: StackTraceNode[] = [];
                for (let ref of node.childrenRefs) {
                    arr.push(flatArray[ref]);
                }
                node.children = arr;

                visit(node.children, flatArray);
            }
        };

        for (const threadNode of threadNodes) {
            if (threadNode.childrenRefs.length) {
                visit([threadNode], threadNode.children);
            }
        }
    }

    static calculateTotalTimes(nodes: Node[]) {
        for (const n of nodes) {
            if (!n.times.length) {
                return;
            }
            n.time = n.times.reduce((a, b) => a + b, 0);
        }
    }
}
