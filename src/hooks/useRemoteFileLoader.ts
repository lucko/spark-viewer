import { useCallback } from 'react';
import { fetchFromRemote } from '../viewer/common/logic/fetch';
import { parse } from '../viewer/common/logic/parse';

export interface UseRemoteFileLoaderResult {
    loadRemoteFile: (downloadPath: string) => Promise<void>;
}

export default function useRemoteFileLoader(
    onDataLoaded: (data: any, metadata: any, exportCallback: any) => void,
    onError: (error: Error) => void
): UseRemoteFileLoaderResult {
    const loadRemoteFile = useCallback(
        async (downloadPath: string) => {
            try {
                // Fetch the remote file
                const result = await fetchFromRemote(downloadPath);
                
                // Parse the data
                const [data, status] = parse(result.type, result.buf);
                
                // Call the success callback
                onDataLoaded(data, data.metadata, result.exportCallback);
            } catch (error) {
                console.error('Failed to load remote file:', error);
                onError(error as Error);
            }
        },
        [onDataLoaded, onError]
    );

    return { loadRemoteFile };
}