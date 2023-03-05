import {
    HeapData as HeapDataProto,
    HeapEntry,
    HeapMetadata,
} from '../proto/spark_pb';

export default class HeapData {
    readonly metadata: HeapMetadata;
    readonly entries: HeapEntry[];

    constructor(buf: ArrayBuffer) {
        const data = HeapDataProto.fromBinary(new Uint8Array(buf));

        this.metadata = data.metadata!;
        this.entries = data.entries;
    }
}
