import {
    HealthData as HealthDataProto,
    HealthMetadata,
    WindowStatistics,
} from '../proto/spark_pb';

export default class HealthData {
    readonly metadata: HealthMetadata;
    readonly timeWindowStatistics: { [key: number]: WindowStatistics };

    constructor(buf: ArrayBuffer) {
        const data = HealthDataProto.fromBinary(new Uint8Array(buf));
        this.metadata = data.metadata!;
        this.timeWindowStatistics = data.timeWindowStatistics;
    }
}
