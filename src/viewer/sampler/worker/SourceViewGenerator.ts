import type { StackTraceNodeWithId, ThreadNodeWithId } from '../../proto/nodes';
import SourcesMap from '../data/SourcesMap';
import NodeAccumulator from '../node/NodeAccumulator';
import type { SamplerWorkerProps } from './SamplerWorker';

export interface SourcesViewData {
    sourcesMerged: SourceViewData[];
    sourcesSeparate: SourceViewData[];
}

export interface SourceViewData {
    source: string;
    threads: SourceThreadNode[];
    totalSourceTime: number;
}

export interface SourceThreadNode {
    name: string;
    id: number;
    threadTime: number;
    threadTimes: number[];
    sourceTime: number;
    children: number[][];
}

export default class SourceViewGenerator {
    private readonly threads: ThreadNodeWithId[];
    private readonly sourcesMap: SourcesMap;
    private readonly sources: string[];

    constructor(props: SamplerWorkerProps) {
        this.threads = props.threads;
        this.sourcesMap = SourcesMap.createFromExisting(props.sources);
        this.sources = this.sourcesMap.getSources();
    }

    public generateView(): SourcesViewData {
        return {
            sourcesMerged: this.generate(true),
            sourcesSeparate: this.generate(false),
        };
    }

    /**
     * Generates a source view using the given merge mode.
     *
     * mergeMode = true -  Method calls with the same signature will be merged together,
     *                     even though they may not have been invoked by the same calling method.
     * mergeMode = false - Method calls that have the same signature, but that haven't been invoked
     *                     by the same calling method will show separately.
     */
    private generate(mergeMode: boolean): SourceViewData[] {
        return this.sources
            .map(source => {
                const threads: SourceThreadNode[] = Array.from(
                    this.threads
                        .map(thread =>
                            this.generateThread(mergeMode, thread, source)
                        )
                        .filter(data => data != null)
                        .map(data => data as SourceThreadNode)
                );

                return {
                    source: source,
                    threads: threads,
                    totalSourceTime: threads.reduce(
                        (a, n) => a + n.sourceTime,
                        0
                    ),
                };
            })
            .filter(data => data.threads.length && data.totalSourceTime)
            .sort((a, b) => b.totalSourceTime - a.totalSourceTime);
    }

    private generateThread(
        mergeMode: boolean,
        thread: ThreadNodeWithId,
        sourceToFind: string
    ): SourceThreadNode | null {
        let acc: StackTraceNodeWithId[][];

        if (mergeMode) {
            acc = this.findMatchesMerge(
                new NodeAccumulator(),
                sourceToFind,
                thread.children
            ).build();
        } else {
            acc = this.findMatchesSeparate(
                [],
                sourceToFind,
                thread.children
            ).map(number => [number]);
        }

        const time = (nodes: StackTraceNodeWithId[]) => {
            return nodes.reduce((acc, node) => acc + node.time, 0);
        };

        acc.sort((a, b) => time(b) - time(a));

        return acc.length
            ? {
                  name: thread.name,
                  id: thread.id,
                  threadTime: thread.time,
                  threadTimes: thread.times,
                  sourceTime: acc.reduce((a, n) => a + time(n), 0),
                  children: acc.map(nodes => {
                      return nodes.map(node => node.id);
                  }),
              }
            : null;
    }

    private findMatchesMerge(
        acc: NodeAccumulator,
        sourceToFind: string,
        nodes: StackTraceNodeWithId[]
    ) {
        for (const node of nodes) {
            const source = this.sourcesMap.getSource(node.id);
            if (
                source === sourceToFind &&
                !SourceViewGenerator.hideNode(node, source)
            ) {
                acc.addNode(node);
            } else {
                // recursive
                this.findMatchesMerge(acc, sourceToFind, node.children);
            }
        }
        return acc;
    }

    private findMatchesSeparate(
        acc: StackTraceNodeWithId[],
        sourceToFind: string,
        nodes: StackTraceNodeWithId[]
    ) {
        for (const node of nodes) {
            const source = this.sourcesMap.getSource(node.id);
            if (
                source === sourceToFind &&
                !SourceViewGenerator.hideNode(node, source)
            ) {
                acc.push(node);
            } else {
                // recursive
                this.findMatchesSeparate(acc, sourceToFind, node.children);
            }
        }
        return acc;
    }

    // forgive carpet replacing the entire tick loop
    static hideNode(node: StackTraceNodeWithId, source: string) {
        return (
            node.className &&
            node.methodName &&
            node.className.startsWith('net.minecraft.server.MinecraftServer') &&
            (node.methodName.endsWith('modifiedRunLoop') ||
                node.methodName.endsWith('fixUpdateSuppressionCrashTick')) &&
            source.includes('carpet')
        );
    }
}
