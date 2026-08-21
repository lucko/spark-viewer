import {
    HealthData as HealthDataProto,
    HealthMetadata,
    SocketChannelInfo,
    WindowStatistics,
} from '../proto/spark_pb';

export default class HealthData {
    readonly metadata: HealthMetadata;
    readonly timeWindowStatistics: { [key: number]: WindowStatistics };
    readonly channelInfo?: SocketChannelInfo;

    constructor(buf: ArrayBuffer) {
        const data = HealthDataProto.fromBinary(new Uint8Array(buf));
        this.metadata = data.metadata!;
        this.timeWindowStatistics = data.timeWindowStatistics;
        this.channelInfo = data.channelInfo;
    }
}
