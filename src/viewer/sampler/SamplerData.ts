import { ThreadNodeWithId } from '../proto/nodes';
import {
    SamplerData as SamplerDataProto,
    SamplerMetadata,
    SocketChannelInfo,
    WindowStatistics,
} from '../proto/spark_pb';
import BottomUpMap from './data/BottomUpMap';
import NodeMap from './data/NodeMap';
import Preprocessing from './data/Preprocessing';
import SourcesMap from './data/SourcesMap';

export default class SamplerData {
    readonly nodes: NodeMap;
    readonly bottomUp: BottomUpMap;
    readonly sources: SourcesMap;

    readonly metadata?: SamplerMetadata;
    readonly threads: ThreadNodeWithId[];

    readonly timeWindows: number[];
    readonly timeWindowStatistics: { [key: number]: WindowStatistics };
    readonly channelInfo?: SocketChannelInfo;

    constructor(buf: ArrayBuffer) {
        const data = SamplerDataProto.fromBinary(new Uint8Array(buf));
        Preprocessing.unflatten(data.threads);

        this.nodes = new NodeMap(data.threads);
        this.bottomUp = new BottomUpMap(this.nodes);
        this.sources = SourcesMap.create(this.nodes.stackTraceNodes, data);

        Preprocessing.calculateTotalTimes(this.nodes.allNodes);

        this.metadata = data.metadata;
        this.threads = data.threads as ThreadNodeWithId[];
        this.timeWindows = data.timeWindows;
        this.timeWindowStatistics = data.timeWindowStatistics;
        this.channelInfo = data.channelInfo;
    }
}
