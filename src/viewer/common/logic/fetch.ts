import { NextRouter } from 'next/router';
import { env } from '../../../env';
import {
    getContentType,
    getContentTypes,
    parseContentType,
    parseFileExtension,
    SparkContentType,
} from './contentType';
import { createExportCallback, ExportCallback } from './export';

export interface FetchResult {
    type: SparkContentType;
    buf: ArrayBuffer;
    exportCallback?: ExportCallback;
}

export async function fetchFromBytebin(
    code: string,
    router: NextRouter | null,
    thumbnail: boolean
) {
    let bytebinUrl = 'https://bytebin.playcdu.co/';
    if (thumbnail && router && router.query['x-bytebin-url']) {
        bytebinUrl = router.query['x-bytebin-url'] as string;
    }
    if (thumbnail && router && router.query['x-bytebin-api-key']) {
        bytebinApiKey = router.query['x-bytebin-api-key'] as string;
    }

    const req = await fetch(`${bytebinUrl}/${code}`, {
        headers: {
            Accept: `${getContentTypes().join(',')}`,
            ...(bytebinApiKey ? { 'Bytebin-Api-Key': bytebinApiKey } : {}),
        },
    });
    if (!req.ok) {
        throw new Error('bytebin request failed');
    }

    const type = parseContentType(req.headers.get('content-type'));
    const buf = await req.arrayBuffer();
    const exportCallback = createExportCallback(code, buf, type);
    return { type, buf, exportCallback };
}

export async function fetchFromFile(selectedFile: File | undefined) {
    // load from selected file
    if (!selectedFile) {
        throw new Error('selectedFile is undefined');
    }

    const extension = parseFileExtension(selectedFile.name.split('.').pop());
    const type = getContentType(extension);
    const buf = await readFileAsync(selectedFile);
    return { type, buf };
}

export function readFileAsync(file: Blob): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result as ArrayBuffer);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}
