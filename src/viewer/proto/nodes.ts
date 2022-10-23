import { StackTraceNode, ThreadNode } from './spark_pb';

export type Node = StackTraceNode | ThreadNode;

export interface ThreadNodeWithSourceTime extends ThreadNode {
    sourceTime: number;
}

export interface StackTraceNodeWithSource extends StackTraceNode {
    source: string;
}

export interface StackTraceNodeWithId extends StackTraceNode {
    id: number | number[];
}

export interface ThreadNodeWithId extends ThreadNode {
    id: number | number[];
}

export type NodeWithId = StackTraceNodeWithId | ThreadNodeWithId;

export interface StackTraceNodeWithParents extends StackTraceNode {
    parents: StackTraceNode[];
}

export type ExtendedStackTraceNode = StackTraceNode &
    StackTraceNodeWithSource &
    StackTraceNodeWithId &
    StackTraceNodeWithParents & { sourceTime?: never };

export type ExtendedThreadNode = ThreadNode &
    ThreadNodeWithSourceTime &
    ThreadNodeWithId & {
        parents?: never;
        source?: never;
        parentLineNumber?: never;
    };

export type ExtendedNode = ExtendedStackTraceNode | ExtendedThreadNode;
