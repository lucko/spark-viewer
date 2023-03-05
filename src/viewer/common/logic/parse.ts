import HeapData from '../../heap/HeapData';
import SamplerData from '../../sampler/SamplerData';
import { SparkContentType } from './contentType';
import { LOADED_HEAP_DATA, LOADED_PROFILE_DATA, Status } from './status';

export function parse(
    type: SparkContentType,
    buf: ArrayBuffer
): [SamplerData | HeapData, Status] {
    if (type === 'application/x-spark-sampler') {
        return parseSampler(buf);
    } else {
        return parseHeap(buf);
    }
}

function parseSampler(buf: ArrayBuffer): [SamplerData, Status] {
    const data = new SamplerData(buf);
    return [data, LOADED_PROFILE_DATA];
}

function parseHeap(buf: ArrayBuffer): [HeapData, Status] {
    const data = new HeapData(buf);
    return [data, LOADED_HEAP_DATA];
}
