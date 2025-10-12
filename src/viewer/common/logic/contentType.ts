export type SparkContentType =
    | 'application/x-spark-sampler'
    | 'application/x-spark-heap'
    | 'application/x-spark-health';

export type SparkFileExtension = 'sparkprofile' | 'sparkheap' | 'sparkhealth';

export function getContentTypes(): SparkContentType[] {
    return [
        'application/x-spark-sampler',
        'application/x-spark-heap',
        'application/x-spark-health',
    ];
}

export function parseContentType(str: string | null): SparkContentType {
    if (
        str === 'application/x-spark-sampler' ||
        str === 'application/x-spark-heap' ||
        str === 'application/x-spark-health'
    )
        return str;
    throw new Error('Unknown content type: ' + str);
}

export function parseFileExtension(
    str: string | undefined
): SparkFileExtension {
    if (str === 'sparkprofile' || str === 'sparkheap' || str === 'sparkhealth')
        return str;
    throw new Error('Unknown file extension: ' + str);
}

export function getFileExtension(
    contentType: SparkContentType
): SparkFileExtension {
    const lookup: Record<SparkContentType, SparkFileExtension> = {
        'application/x-spark-sampler': 'sparkprofile',
        'application/x-spark-heap': 'sparkheap',
        'application/x-spark-health': 'sparkhealth',
    };
    return lookup[contentType];
}

export function getContentType(
    fileExtension: SparkFileExtension
): SparkContentType {
    const lookup: Record<SparkFileExtension, SparkContentType> = {
        sparkprofile: 'application/x-spark-sampler',
        sparkheap: 'application/x-spark-heap',
        sparkhealth: 'application/x-spark-health',
    };
    return lookup[fileExtension];
}
