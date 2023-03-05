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
import HeaderWithMappings from '../components/HeaderWithMappings';
import SparkLayout from '../components/SparkLayout';
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
import { isSamplerMetadata } from './proto/guards';
import { HeapMetadata, SamplerMetadata } from './proto/spark_pb';
import useMappings from './sampler/hooks/useMappings';
import SamplerData from './sampler/SamplerData';

const Heap = dynamic(() => import('./heap/Heap'), {
    suspense: true,
});
const Sampler = dynamic(() => import('./sampler/components/Sampler'), {
    suspense: true,
});
const Thumbnail = dynamic(() => import('./common/components/Thumbnail'), {
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

    // if rendering thumbnail -- '?x-render-thumbnail=true' flag in the URL
    const thumbnailOnly = useMemo(() => {
        return router.query['x-render-thumbnail'] !== undefined;
    }, [router]);

    const mappings = useMappings(
        metadata && isSamplerMetadata(metadata) ? metadata : undefined
    );

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
                    result = await fetchFromBytebin(
                        code,
                        router,
                        thumbnailOnly
                    );
                } else {
                    result = await fetchFromFile(selectedFile);
                }

                if (result.exportCallback) {
                    setExportCallback(() => result.exportCallback);
                }

                if (!thumbnailOnly) {
                    mappings.load(result.type);
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
    }, [
        status,
        setStatus,
        code,
        selectedFile,
        thumbnailOnly,
        mappings,
        router,
    ]);

    if (
        thumbnailOnly &&
        (status === LOADED_PROFILE_DATA || status === LOADED_HEAP_DATA)
    ) {
        return (
            <Suspense fallback={null}>
                <Thumbnail code={code} metadata={metadata!} />
            </Suspense>
        );
    }

    let contents;
    switch (status) {
        case LOADING_DATA:
            contents = (
                <TextBox>
                    {code === '_' ? 'Loading file...' : 'Downloading...'}
                </TextBox>
            );
            break;
        case FAILED_DATA:
            contents = (
                <TextBox extraClassName="loading-error">
                    Unable to load the data. Perhaps it expired? Are you using a
                    recent version?
                </TextBox>
            );
            break;
        case LOADED_PROFILE_DATA:
            contents = (
                <Suspense fallback={<TextBox>Loading...</TextBox>}>
                    <Sampler
                        data={data as SamplerData}
                        fetchUpdatedData={fetchUpdatedData}
                        metadata={metadata as SamplerMetadata}
                        setMetadata={setMetadata}
                        mappings={mappings.mappingsResolver}
                        exportCallback={exportCallback!}
                    />
                </Suspense>
            );
            break;
        case LOADED_HEAP_DATA:
            contents = (
                <Suspense fallback={<TextBox>Loading...</TextBox>}>
                    <Heap
                        data={data as HeapData}
                        metadata={metadata as HeapMetadata}
                        exportCallback={exportCallback!}
                    />
                </Suspense>
            );
            break;
        default:
            contents = <TextBox>Unknown state - this is a bug.</TextBox>;
            break;
    }

    return (
        <SparkLayout
            header={
                <HeaderWithMappings
                    mappingsMetadata={mappings.mappingsMetadata}
                    mappings={mappings.mappingsType}
                    setMappings={mappings.requestMappings}
                />
            }
        >
            {contents}
        </SparkLayout>
    );
}
