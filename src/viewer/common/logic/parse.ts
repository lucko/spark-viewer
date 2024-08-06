import HealthData from '../../health/HealthData';
import HeapData from '../../heap/HeapData';
import SamplerData from '../../sampler/SamplerData';
import { SparkContentType } from './contentType';
import {
    LOADED_HEALTH_DATA,
    LOADED_HEAP_DATA,
    LOADED_PROFILE_DATA,
    Status,
} from './status';

export function parse(
    type: SparkContentType,
    buf: ArrayBuffer
): [SamplerData | HeapData | HealthData, Status] {
    if (type === 'application/x-spark-sampler') {
        return parseSampler(buf);
    } else if (type === 'application/x-spark-heap') {
        return parseHeap(buf);
    } else if (type === 'application/x-spark-health') {
        return parseHealth(buf);
    } else {
        throw new Error('Unknown content type: ' + type);
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

function parseHealth(buf: ArrayBuffer): [HealthData, Status] {
    const data = new HealthData(buf);
    return [data, LOADED_HEALTH_DATA];
}
