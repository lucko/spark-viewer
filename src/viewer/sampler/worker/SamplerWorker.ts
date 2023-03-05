import { expose } from 'comlink';
import type { ThreadNodeWithId } from '../../proto/nodes';
import type SourcesMap from '../data/SourcesMap';
import FlatViewGenerator, { FlatViewData } from './FlatViewGenerator';
import SourceViewGenerator, { SourcesViewData } from './SourceViewGenerator';

export interface SamplerWorkerProps {
    threads: ThreadNodeWithId[];
    sources: SourcesMap;
}

export class SamplerWorker {
    private readonly props: SamplerWorkerProps;

    constructor(props: SamplerWorkerProps) {
        this.props = props;
    }

    public generateFlatView(): FlatViewData {
        return new FlatViewGenerator(this.props).generateView();
    }

    public generateSourcesView(): SourcesViewData {
        return new SourceViewGenerator(this.props).generateView();
    }
}

expose(SamplerWorker);
