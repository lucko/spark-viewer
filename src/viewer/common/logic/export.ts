import { getFileExtension, SparkContentType } from './contentType';

export type ExportCallback = () => void;

export function createExportCallback(
    code: string,
    buf: ArrayBuffer,
    contentType: SparkContentType
): ExportCallback {
    return () => {
        const url = URL.createObjectURL(new Blob([buf], { type: contentType }));

        const el = document.createElement('a');
        el.setAttribute('href', url);
        el.setAttribute('download', `${code}.${getFileExtension(contentType)}`);
        el.click();

        URL.revokeObjectURL(url);
    };
}
