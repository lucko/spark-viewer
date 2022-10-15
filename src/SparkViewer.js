import {
    Suspense,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { HeapData, SamplerData } from './proto';
import { getMappingsInfo, requestMappings } from './sampler/mappings';
import {
    calculateTotalTimes,
    labelData,
    labelDataWithSource,
} from './sampler/preprocessing';
import {
    FAILED_DATA,
    LOADED_HEAP_DATA,
    LOADED_PROFILE_DATA,
    LOADING_DATA,
} from './status';

import ls from 'local-storage';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Pbf from 'pbf';
import HeaderWithMappings from './components/HeaderWithMappings';
import SparkLayout from './components/SparkLayout';
import TextBox from './components/TextBox';
import { SelectedFileContext } from './pages/_app';

const Heap = dynamic(() => import('./heap'), { suspense: true });
const Sampler = dynamic(() => import('./sampler'), { suspense: true });
const Thumbnail = dynamic(() => import('./components/Thumbnail'), {
    suspense: true,
});

export default function SparkViewer() {
    const router = useRouter();

    const code = useMemo(() => {
        return router.query['code'];
    }, [router]);

    const { selectedFile } = useContext(SelectedFileContext);

    // the current status of the viewer
    const [status, setStatus] = useState(LOADING_DATA);

    // the data payload currently loaded
    const [loaded, setLoaded] = useState(null);
    // the export callback
    const [exportCallback, setExportCallback] = useState(null);

    // if rendering thumbnail -- '?x-render-thumbnail=true' flag in the URL
    const thumbnailOnly = useMemo(() => {
        return router.query['x-render-thumbnail'] !== undefined;
    }, [router]);

    // the mappings info object currently loaded
    const [mappingsInfo, setMappingsInfo] = useState(null);
    // the current mappings function
    const [mappings, setMappings] = useState({
        func: _ => {},
    });
    // the current mappings type
    const [mappingsType, setMappingsType] = useState(
        ls.get('spark-mappings-pref') === 'none' ? 'none' : 'auto'
    );

    // Function called whenever the user picks mappings, either
    // from the input dropdown, or 'auto' when mappings info is loaded.
    const onMappingsRequest = useCallback(
        type => {
            if (mappingsType !== type) {
                setMappingsType(type);
                requestMappings(type, mappingsInfo, loaded).then(func => {
                    setMappings({ func });
                });

                if (type === 'none') {
                    ls.set('spark-mappings-pref', 'none');
                } else {
                    ls.remove('spark-mappings-pref');
                }
            }
        },
        [mappingsType, mappingsInfo, loaded]
    );

    // Wait for mappingsInfo and the data ('loaded') to be populated,
    // then run a mappings request for 'auto'.
    useEffect(() => {
        if (mappingsInfo && loaded && mappingsType === 'auto') {
            requestMappings('auto', mappingsInfo, loaded).then(func => {
                setMappings({ func });
            });
        }
    }, [mappingsType, mappingsInfo, loaded]);

    // On page load, if status is set to LOADING_DATA, make
    // a request to bytebin to load the payload
    useEffect(() => {
        if (!code || status !== LOADING_DATA) {
            return;
        }

        // Function to parse the data payload from a request given the schema type
        function parse(buf, schema) {
            const pbf = new Pbf(new Uint8Array(buf));
            return schema.read(pbf);
        }

        // Loads sampler data from the given request
        function loadSampler(buf) {
            const data = parse(buf, SamplerData);
            if (!thumbnailOnly) {
                labelData(data.threads, 0);
                labelDataWithSource(data);
                calculateTotalTimes(data.threads);
            }
            setLoaded(data);
            setStatus(LOADED_PROFILE_DATA);
        }

        // Loads heap data from the given request
        function loadHeap(buf) {
            const data = parse(buf, HeapData);
            setLoaded(data);
            setStatus(LOADED_HEAP_DATA);
        }

        (async () => {
            try {
                let type;
                let buf;

                if (code !== '_') {
                    // load from bytebin
                    const req = await fetch(`https://bytebin.lucko.me/${code}`);
                    if (!req.ok) {
                        setStatus(FAILED_DATA);
                        return;
                    }

                    type = req.headers.get('content-type');
                    buf = await req.arrayBuffer();
                    if (type === 'application/x-spark-sampler') {
                        setExportCallback(() =>
                            createSamplerExportCallback(code, buf)
                        );
                    }
                } else {
                    // load from selected file
                    type = {
                        sparkprofile: 'application/x-spark-sampler',
                        sparkheap: 'application/x-spark-heap',
                    }[selectedFile.name.split('.').pop()];
                    buf = await readFileAsync(selectedFile);
                }

                if (type === 'application/x-spark-sampler') {
                    if (!thumbnailOnly) {
                        getMappingsInfo().then(setMappingsInfo);
                    }
                    loadSampler(buf);
                } else if (type === 'application/x-spark-heap') {
                    loadHeap(buf);
                } else {
                    setStatus(FAILED_DATA);
                }
            } catch (e) {
                console.log(e);
                setStatus(FAILED_DATA);
            }
        })();
    }, [status, setStatus, code, selectedFile, thumbnailOnly]);

    if (
        thumbnailOnly &&
        (status === LOADED_PROFILE_DATA || status === LOADED_HEAP_DATA)
    ) {
        return (
            <Suspense>
                <Thumbnail code={code} data={loaded} />
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
                        data={loaded}
                        mappings={mappings}
                        exportCallback={exportCallback}
                    />
                </Suspense>
            );
            break;
        case LOADED_HEAP_DATA:
            contents = (
                <Suspense fallback={<TextBox>Loading...</TextBox>}>
                    <Heap data={loaded} />
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
                    mappingsInfo={mappingsInfo}
                    mappings={mappingsType}
                    setMappings={onMappingsRequest}
                />
            }
        >
            {contents}
        </SparkLayout>
    );
}

function readFileAsync(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

function createSamplerExportCallback(code, buf) {
    return () => {
        const url = URL.createObjectURL(
            new Blob([buf], { type: 'application/x-spark-sampler' })
        );

        const el = document.createElement('a');
        el.setAttribute('href', url);
        el.setAttribute('download', `${code}.sparkprofile`);
        el.click();

        URL.revokeObjectURL(url);
    };
}
