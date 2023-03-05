import { StackTraceNode, ThreadNode } from './spark_pb';

export type Node = StackTraceNode | ThreadNode;

export interface StackTraceNodeWithId extends StackTraceNode {
    id: number;
    children: StackTraceNodeWithId[];
}

export interface ThreadNodeWithId extends ThreadNode {
    id: number;
    children: StackTraceNodeWithId[];
}

export type NodeWithId = StackTraceNodeWithId | ThreadNodeWithId;

export type StackTraceNodeDetails = { type: 'stackTrace' } & Pick<
    StackTraceNode,
    | 'className'
    | 'methodName'
    | 'parentLineNumber'
    | 'lineNumber'
    | 'methodDesc'
>;
export type ThreadNodeDetails = { type: 'thread' } & Pick<ThreadNode, 'name'>;
export type NodeDetails = StackTraceNodeDetails | ThreadNodeDetails;
