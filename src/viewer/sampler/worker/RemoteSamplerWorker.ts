import { releaseProxy, Remote, wrap } from 'comlink';
import SamplerData from '../SamplerData';
import { FlatViewData } from './FlatViewGenerator';
import type { SamplerWorker, SamplerWorkerProps } from './SamplerWorker';
import { SourcesViewData } from './SourceViewGenerator';

export default class RemoteSamplerWorker {
    static async create(data: SamplerData): Promise<RemoteSamplerWorker> {
        const worker = new Worker(
            new URL('./SamplerWorker.ts', import.meta.url)
        );
        const SamplerWorker = wrap<SamplerWorker>(worker) as any;

        const props: SamplerWorkerProps = {
            threads: data.threads,
            sources: data.sources,
        };
        const proxy = (await new SamplerWorker(props)) as Remote<SamplerWorker>;
        return new RemoteSamplerWorker(proxy);
    }

    constructor(private readonly proxy: Remote<SamplerWorker>) {}

    public generateFlatView(): Promise<FlatViewData> {
        return this.proxy.generateFlatView();
    }

    public generateSourcesView(): Promise<SourcesViewData> {
        return this.proxy.generateSourcesView();
    }

    public close() {
        this.proxy[releaseProxy]();
    }
}
