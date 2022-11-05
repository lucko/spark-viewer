export type SparkContentType =
    | 'application/x-spark-sampler'
    | 'application/x-spark-heap';

export type SparkFileExtension = 'sparkprofile' | 'sparkheap';

export function getContentTypes(): SparkContentType[] {
    return ['application/x-spark-sampler', 'application/x-spark-heap'];
}

export function parseContentType(str: string | null): SparkContentType {
    if (
        str === 'application/x-spark-sampler' ||
        str === 'application/x-spark-heap'
    )
        return str;
    throw new Error('Unknown content type: ' + str);
}

export function parseFileExtension(
    str: string | undefined
): SparkFileExtension {
    if (str === 'sparkprofile' || str === 'sparkheap') return str;
    throw new Error('Unknown file extension: ' + str);
}

export function getFileExtension(
    contentType: SparkContentType
): SparkFileExtension {
    const lookup: Record<SparkContentType, SparkFileExtension> = {
        'application/x-spark-sampler': 'sparkprofile',
        'application/x-spark-heap': 'sparkheap',
    };
    return lookup[contentType];
}

export function getContentType(
    fileExtension: SparkFileExtension
): SparkContentType {
    const lookup: Record<SparkFileExtension, SparkContentType> = {
        sparkprofile: 'application/x-spark-sampler',
        sparkheap: 'application/x-spark-heap',
    };
    return lookup[fileExtension];
}
