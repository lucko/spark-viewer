import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import {
    Suspense,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import TextBox from '../components/TextBox';
import { SelectedFileContext } from '../pages/_app';
import { ExportCallback } from './common/logic/export';
import {
    fetchFromBytebin,
    fetchFromFile,
    FetchResult,
} from './common/logic/fetch';
import { parse } from './common/logic/parse';
import {
    FAILED_DATA,
    LOADED_HEAP_DATA,
    LOADED_PROFILE_DATA,
    LOADING_DATA,
    Status,
} from './common/logic/status';
import HeapData from './heap/HeapData';
import { HeapMetadata, SamplerMetadata } from './proto/spark_pb';
import SamplerData from './sampler/SamplerData';

const Heap = dynamic(() => import('./heap/Heap'), {
    suspense: true,
});
const Sampler = dynamic(() => import('./sampler/components/Sampler'), {
    suspense: true,
});

export default function SparkViewer() {
    const router = useRouter();

    const code = useMemo(() => {
        return router.query['code'] as string;
    }, [router]);

    const { selectedFile } = useContext(SelectedFileContext);
    const [status, setStatus] = useState<Status>(LOADING_DATA);
    const [data, setData] = useState<SamplerData | HeapData>();
    const [metadata, setMetadata] = useState<SamplerMetadata | HeapMetadata>();
    const [exportCallback, setExportCallback] = useState<ExportCallback>();

    const fetchUpdatedData = useCallback(
        async (payloadId: string) => {
            const { type, buf, exportCallback } = await fetchFromBytebin(
                payloadId,
                null,
                false
            );
            setExportCallback(() => exportCallback);
            const [data] = parse(type, buf);
            setData(data);
            setMetadata(data.metadata);
        },
        [setExportCallback, setData]
    );

    // On page load, if status is set to LOADING_DATA, make
    // a request to bytebin to load the payload
    useEffect(() => {
        if (!code || status !== LOADING_DATA) {
            return;
        }

        (async () => {
            try {
                let result: FetchResult;
                if (code !== '_') {
                    result = await fetchFromBytebin(code, router, false);
                } else {
                    result = await fetchFromFile(selectedFile);
                }

                if (result.exportCallback) {
                    setExportCallback(() => result.exportCallback);
                }

                const [data, status] = parse(result.type, result.buf);
                setData(data);
                setMetadata(data.metadata);
                setStatus(status);
            } catch (e) {
                console.log(e);
                setStatus(FAILED_DATA);
            }
        })();
    }, [status, setStatus, code, selectedFile, router]);

    switch (status) {
        case LOADING_DATA:
            return (
                <TextBox>
                    {code === '_' ? 'Loading file...' : 'Downloading...'}
                </TextBox>
            );
        case FAILED_DATA:
            return (
                <TextBox extraClassName="loading-error">
                    Unable to load the data. Perhaps it expired? Are you using a
                    recent version?
                </TextBox>
            );
        case LOADED_PROFILE_DATA:
            return (
                <Suspense fallback={<TextBox>Loading...</TextBox>}>
                    <Sampler
                        data={data as SamplerData}
                        fetchUpdatedData={fetchUpdatedData}
                        metadata={metadata as SamplerMetadata}
                        setMetadata={setMetadata}
                        exportCallback={exportCallback!}
                    />
                </Suspense>
            );
        case LOADED_HEAP_DATA:
            return (
                <Suspense fallback={<TextBox>Loading...</TextBox>}>
                    <Heap
                        data={data as HeapData}
                        metadata={metadata as HeapMetadata}
                        exportCallback={exportCallback!}
                    />
                </Suspense>
            );
        default:
            return <TextBox>Unknown state - this is a bug.</TextBox>;
    }
}
