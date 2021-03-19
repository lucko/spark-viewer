import React, { useEffect, useState, useCallback } from 'react';
import Pbf from 'pbf';
import history from 'history/browser';
import ls from 'local-storage';

import Homepage from './Homepage';
import Sampler, { labelData } from './sampler/Sampler';
import Heap from './heap/Heap';
import MappingsMenu from './sampler/MappingsMenu';

import { SamplerData, HeapData } from './proto'
import { getMappingsInfo, requestMappings } from './sampler/mappings'

import sparkLogo from './assets/spark-logo.svg'

const HOMEPAGE = Symbol();
const LOADING_DATA = Symbol();
const PARSING_DATA = Symbol();
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
            hash: ''
        });
    } else if (/^\/[a-zA-Z0-9]+$/.test(path)) {
        code = path.substring(1);
    }
    return code;
}

export default function SparkRoot() {
    const [code] = useState(getUrlCode);
    const [status, setStatus] = useState(code ? LOADING_DATA : window.location.pathname === '/' ? HOMEPAGE : PAGE_NOT_FOUND);
    const [loaded, setLoaded] = useState(null);
    const [mappingsInfo, setMappingsInfo] = useState(null);
    const [mappings, setMappings] = useState({func: _ => {}});
    const [mappingsType, setMappingsType] = useState(ls.get('spark-mappings-pref') === 'none' ? 'none' : 'auto');

    // Function called whenever the user picks mappings, either
    // from the input dropdown, or 'auto' when mappings info is loaded.
    const onMappingsRequest = useCallback(type => {
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
    }, [mappingsType, mappingsInfo, loaded]);

    // Wait for mappingsInfo and data ('loaded') to be populated,
    // then run a mappings request for 'auto'.
    useEffect(() => {
        if (mappingsInfo && loaded && mappingsType === 'auto') {
            requestMappings('auto', mappingsInfo, loaded).then(func => {
                setMappings({ func });
            });
        }
    }, [mappingsType, mappingsInfo, loaded, onMappingsRequest]);

    // On page load, if status is set to LOADING_DATA, make
    // a request to bytebin to load the payload
    useEffect(() => {
        if (status !== LOADING_DATA) {
            return;
        }

        function initSampler(buf) {
            setStatus(PARSING_DATA);
            const pbf = new Pbf(new Uint8Array(buf));
            const data = SamplerData.read(pbf);
            labelData(data.threads, 0);
            setLoaded(data);
            setStatus(LOADED_PROFILE_DATA);
        }

        function initHeap(buf) {
            setStatus(PARSING_DATA);
            const pbf = new Pbf(new Uint8Array(buf));
            const data = HeapData.read(pbf);
            setLoaded(data);
            setStatus(LOADED_HEAP_DATA);
        }

        async function onLoad() {
            try {
                const req = await fetch(`https://bytebin.lucko.me/${code}`);
                if (!req.ok) {
                    setStatus(FAILED_DATA);
                    return;
                }

                const type = req.headers.get('content-type');
                if (type === 'application/x-spark-sampler') {
                    // request mappings metadata in the background
                    getMappingsInfo().then(setMappingsInfo);
                    const buf = await req.arrayBuffer();
                    initSampler(buf);
                } else if (type === 'application/x-spark-heap') {
                    const buf = await req.arrayBuffer();
                    initHeap(buf);
                } else {
                    setStatus(FAILED_DATA);
                }
            } catch (e) {
                console.log(e);
                setStatus(FAILED_DATA);
            }
        }

        onLoad().then(_ => {});
    }, [status, code]);

    let contents;
    switch (status) {
        case HOMEPAGE:
            contents = <Homepage />
            break
        case PAGE_NOT_FOUND:
            contents = <BannerNotice>404 - Page Not Found</BannerNotice>
            break
        case LOADING_DATA:
            contents = <BannerNotice>Downloading...</BannerNotice>
            break
        case PARSING_DATA:
            contents = <BannerNotice>Rendering...</BannerNotice>
            break
        case FAILED_DATA:
            contents = <BannerNotice>Unable to load the data. Perhaps it expired? Are you using a recent version?</BannerNotice>
            break
        case LOADED_PROFILE_DATA:
            contents = <Sampler data={loaded} mappings={mappings} />
            break
        case LOADED_HEAP_DATA:
            contents = <Heap data={loaded} />
            break
        default:
            contents = <BannerNotice>Unknown state - this is a bug.</BannerNotice>
            break
    }
    return <>
        <Header isViewer={!!code} mappingsInfo={mappingsInfo} mappings={mappingsType} setMappings={onMappingsRequest} />
        {contents}
        <Footer />
    </>
}

function Header({ isViewer, mappingsInfo, mappings, setMappings }) {
    return (
        <div id="header">
            <a href="/" id="logo">
                <img src={sparkLogo} alt="" width="32px" height="32px" />
                {isViewer
                    ? <h1>spark viewer</h1>
                    : <h1>spark</h1>
                }
            </a>
            {!!mappingsInfo && <MappingsMenu {...{mappingsInfo, mappings, setMappings}} />}
        </div>
    )
}

function Footer() {
    return (
        <div id="footer">
            <a href="https://github.com/lucko/spark">spark</a> and <a href="https://github.com/lucko/spark-viewer">spark-viewer</a> are based on WarmRoast by sk89q.<br />
            Copyright &copy; 2018-2021 <a href="https://github.com/lucko">lucko</a>, <a href="https://github.com/astei">astei</a> & spark contributors
        </div>
    )
}

function BannerNotice(props) {
    return <div className="banner-notice">{props.children}</div>
}
