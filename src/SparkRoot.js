import React, { useEffect, useState, useCallback } from 'react';
import Pbf from 'pbf';
import history from 'history/browser';
import ls from 'local-storage';

import Homepage from './Homepage';
import Download from './Download';
import Sampler from './sampler/Sampler';
import Heap from './heap/Heap';
import BannerNotice from './misc/BannerNotice';

import { SamplerData, HeapData } from './proto';

import MappingsMenu, {
    getMappingsInfo,
    requestMappings,
} from './sampler/mappings';
import {
    labelData,
    labelDataWithSource,
    generateSourceViews,
} from './sampler/preprocessing';

import sparkLogo from './assets/spark-logo.svg';

const HOMEPAGE = Symbol();
const DOWNLOAD = Symbol();
const LOADING_DATA = Symbol();
const LOADING_FILE = Symbol();
const FAILED_DATA = Symbol();
const LOADED_PROFILE_DATA = Symbol();
const LOADED_HEAP_DATA = Symbol();
const PAGE_NOT_FOUND = Symbol();

/**
 * Gets the payload code from the URL.
 * @returns the code, or undefined
 */
function getUrlCode() {
    const path = window.location.pathname;
    const hash = window.location.hash;

    let code;
    if (path === '/' && /^#[a-zA-Z0-9]+$/.test(hash)) {
        code = hash.substring(1);
        // change URL to remove the hash
        history.replace({
            pathname: code,
            hash: '',
        });
    } else if (/^\/[a-zA-Z0-9]+$/.test(path)) {
        code = path.substring(1);
    }
    return code;
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

export default function SparkRoot() {
    // the data code from the URL path
    const [code] = useState(getUrlCode);
    // the 'selected' file
    const [selectedFile, setSelectedFile] = useState();
    // if raw output mode is enabled -- '?raw=1' flag in the URL
    const [rawMode] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('raw') !== null;
    });
    // the status of this component
    const [status, setStatus] = useState(() => {
        if (code && code === 'download') {
            return DOWNLOAD;
        } else if (code) {
            return LOADING_DATA;
        } else if (window.location.pathname === '/') {
            return HOMEPAGE;
        } else {
            return PAGE_NOT_FOUND;
        }
    });
    // the data payload currently loaded
    const [loaded, setLoaded] = useState(null);
    // the export callback
    const [exportCallback, setExportCallback] = useState(null);

    const onFileSelected = file => {
        setSelectedFile(file);
        setStatus(LOADING_FILE);
    };

    // the mappings info object currently loaded
    const [mappingsInfo, setMappingsInfo] = useState(null);
    // the current mappings function
    const [mappings, setMappings] = useState({ func: _ => {} });
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
        if (!(status === LOADING_DATA || status === LOADING_FILE)) {
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
            if (!rawMode) {
                labelData(data.threads, 0);
                labelDataWithSource(data);
                generateSourceViews(data);
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

                if (status === LOADING_DATA) {
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
                    if (!rawMode) {
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
    }, [status, code, selectedFile, rawMode]);

    if (
        rawMode &&
        (status === LOADED_PROFILE_DATA || status === LOADED_HEAP_DATA)
    ) {
        return (
            <pre style={{ position: 'absolute', top: 0 }}>
                {JSON.stringify(loaded, null, 2)}
            </pre>
        );
    }

    let contents;
    switch (status) {
        case HOMEPAGE:
            contents = <Homepage onFileSelected={onFileSelected} />;
            break;
        case DOWNLOAD:
            contents = <Download />;
            break;
        case PAGE_NOT_FOUND:
            contents = <BannerNotice>404 - Page Not Found</BannerNotice>;
            break;
        case LOADING_DATA:
            contents = <BannerNotice>Downloading...</BannerNotice>;
            break;
        case LOADING_FILE:
            contents = <BannerNotice>Loading file...</BannerNotice>;
            break;
        case FAILED_DATA:
            contents = (
                <BannerNotice>
                    Unable to load the data. Perhaps it expired? Are you using a
                    recent version?
                </BannerNotice>
            );
            break;
        case LOADED_PROFILE_DATA:
            contents = (
                <Sampler
                    data={loaded}
                    mappings={mappings}
                    exportCallback={exportCallback}
                />
            );
            break;
        case LOADED_HEAP_DATA:
            contents = <Heap data={loaded} />;
            break;
        default:
            contents = (
                <BannerNotice>Unknown state - this is a bug.</BannerNotice>
            );
            break;
    }
    return (
        <>
            <Header
                isViewer={(code && status !== DOWNLOAD) || !!selectedFile}
                mappingsInfo={mappingsInfo}
                mappings={mappingsType}
                setMappings={onMappingsRequest}
            />
            <main>{contents}</main>
            <Footer />
        </>
    );
}

function Header({ isViewer, mappingsInfo, mappings, setMappings }) {
    return (
        <header>
            <a href="/" className="logo">
                <img src={sparkLogo} alt="" width="32px" height="32px" />
                {isViewer ? <h1>spark viewer</h1> : <h1>spark</h1>}
            </a>
            {!!mappingsInfo && (
                <MappingsMenu {...{ mappingsInfo, mappings, setMappings }} />
            )}
        </header>
    );
}

function Footer() {
    return (
        <footer>
            <a href="https://github.com/lucko/spark">spark</a> and{' '}
            <a href="https://github.com/lucko/spark-viewer">spark-viewer</a> are
            based on WarmRoast by sk89q.
            <br />
            Copyright &copy; 2018-2021{' '}
            <a href="https://github.com/lucko">lucko</a>,{' '}
            <a href="https://github.com/astei">astei</a> & spark contributors
        </footer>
    );
}
