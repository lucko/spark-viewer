import { HeapData, SamplerData } from '../../proto/spark_pb';
import {
    calculateTotalTimes,
    labelData,
    labelDataWithSource,
} from '../../sampler/logic/preprocessing/preprocessing';
import { SparkContentType } from './contentType';
import { LOADED_HEAP_DATA, LOADED_PROFILE_DATA, Status } from './status';

export function parse(
    type: SparkContentType,
    buf: ArrayBuffer,
    runPreprocessing: boolean
): [SamplerData | HeapData, Status] {
    if (type === 'application/x-spark-sampler') {
        return parseSampler(buf, runPreprocessing);
    } else {
        return parseHeap(buf);
    }
}

function parseSampler(
    buf: ArrayBuffer,
    runPreprocessing: boolean
): [SamplerData, Status] {
    const data = SamplerData.fromBinary(new Uint8Array(buf));
    if (runPreprocessing) {
        labelData(data.threads, 0);
        labelDataWithSource(data);
        calculateTotalTimes(data.threads);
    }
    return [data, LOADED_PROFILE_DATA];
}

function parseHeap(buf: ArrayBuffer): [HeapData, Status] {
    const data = HeapData.fromBinary(new Uint8Array(buf));
    return [data, LOADED_HEAP_DATA];
}
