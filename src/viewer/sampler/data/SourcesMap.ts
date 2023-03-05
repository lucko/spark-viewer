import type { StackTraceNodeWithId } from '../../proto/nodes';
import type { SamplerData, StackTraceNode } from '../../proto/spark_pb';

export type SourcesMapProps = Pick<
    SamplerData,
    'classSources' | 'methodSources' | 'lineSources'
>;

export default class SourcesMap {
    static excludes: (node: StackTraceNode) => boolean = node =>
        node.className.startsWith(
            'com.destroystokyo.paper.event.executor.asm.generated.'
        );

    static createFromExisting(map: SourcesMap) {
        return new SourcesMap(map.sources, map.idToSource);
    }

    static create(nodes: StackTraceNodeWithId[], props: SourcesMapProps) {
        const { classSources, methodSources, lineSources } = props;
        if (!(classSources || methodSources || lineSources)) {
            return new SourcesMap([], new Map());
        }

        const sources = Array.from(
            new Set([
                ...Object.values(classSources || {}),
                ...Object.values(methodSources || {}),
                ...Object.values(lineSources || {}),
            ])
        );

        const idToSource = new Map<number, string>();

        for (const node of nodes) {
            if (node.className && !SourcesMap.excludes(node)) {
                let source;

                // methodSources
                if (methodSources && node.methodName && node.methodDesc) {
                    const key = `${node.className};${node.methodName};${node.methodDesc}`;
                    source = methodSources[key];
                }

                // lineSources
                if (!source && lineSources && node.lineNumber) {
                    const key = `${node.className};${node.lineNumber}`;
                    source = lineSources[key];
                }

                // classSources
                if (!source && classSources) {
                    source = classSources[node.className];
                }

                if (source && !['minecraft', 'java'].includes(source)) {
                    idToSource.set(node.id as number, source);
                }
            }
        }

        return new SourcesMap(sources, idToSource);
    }

    constructor(
        readonly sources: string[],
        readonly idToSource: Map<number, string>
    ) {}

    public getSource(id: number): string | undefined {
        return this.idToSource.get(id);
    }

    public getSources() {
        return this.sources;
    }

    public hasSources() {
        return this.idToSource.size > 0;
    }
}
