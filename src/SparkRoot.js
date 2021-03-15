import React, { useEffect, useState, useCallback } from 'react';
import Pbf from 'pbf'
import history from 'history/browser';
import { SamplerData, HeapData } from './proto'
import { Sampler, MappingsMenu, labelData } from './types/Sampler';
import { getMappingsInfo, requestMappings } from './mappings'
import { Heap } from './types/Heap';

import sparkLogo from './assets/spark-logo.svg'

const HOMEPAGE = Symbol();
const LOADING_DATA = Symbol();
const PARSING_DATA = Symbol();
const FAILED_DATA = Symbol();
const LOADED_PROFILE_DATA = Symbol();
const LOADED_HEAP_DATA = Symbol();
const PAGE_NOT_FOUND = Symbol();

function Header({ isViewer, mappings, setMappings }) {
    return (
        <div id="header">
            <a href="/" id="logo">
                <img src={sparkLogo} alt="" width="32px" height="32px" />
                {isViewer ? <h1>spark viewer</h1> : <h1>spark</h1>}
            </a>
            {mappings ? <MappingsMenu mappings={mappings} setMappings={setMappings} /> : null}
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

export default function SparkRoot() {
    const [code] = useState(() => {
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
    });

    const [status, setStatus] = useState(code ? LOADING_DATA : window.location.pathname === '/' ? HOMEPAGE : PAGE_NOT_FOUND);
    const [loaded, setLoaded] = useState(null);
    const [mappingsInfo, setMappingsInfo] = useState(null);
    const [mappings, setMappings] = useState({func: _ => {}});
    const [mappingsType, setMappingsType] = useState(null);

    const onMappingsRequest = useCallback((type) => {
        if (mappingsType !== type) {
            setMappingsType(type);
            requestMappings(type, mappingsInfo, loaded).then(func => {
                setMappings({ func });
            })
        }
    }, [mappingsType, mappingsInfo, loaded]);

    useEffect(() => {
        if (!mappingsType && mappingsInfo && loaded) {
            onMappingsRequest('auto');
        }
    }, [mappingsType, mappingsInfo, loaded, onMappingsRequest]);

    useEffect(() => {
        if (status !== LOADING_DATA) {
            return;
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
                    setStatus(PARSING_DATA);
                    const pbf = new Pbf(new Uint8Array(buf));
                    const data = SamplerData.read(pbf);
                    labelData(data);

                    setLoaded(data);
                    setStatus(LOADED_PROFILE_DATA);
                } else if (type === 'application/x-spark-heap') {
                    const buf = await req.arrayBuffer();
                    setStatus(PARSING_DATA);
                    const pbf = new Pbf(new Uint8Array(buf));
                    const data = HeapData.read(pbf);

                    setLoaded(data);
                    setStatus(LOADED_HEAP_DATA);
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
            contents = (
                <div id="intro">
                    <h1># spark</h1>
                    <p>spark is a performance profiling plugin/mod for Minecraft clients, servers and proxies.</p>
                    <p>spark is made up of three separate components:</p>
                    <ul>
                        <li><b>CPU Profiler</b>: Diagnose performance issues with your server.</li>
                        <li><b>Memory Inspection</b>: Diagnose memory issues with your server.</li>
                        <li><b>Server Health Reporting</b>: Keep track of your servers overall health.</li>
                    </ul>
                    <p>You can find <a href="https://spark.lucko.me/docs">documentation</a> for spark on our docs website.</p>
                    <p>You can <a href="https://ci.lucko.me/job/spark/">download</a> the latest version of the plugin from Jenkins.</p>
                    <p>The source code and more information about the spark plugin is available on <a href="https://github.com/lucko/spark">GitHub</a>.</p>

                    <h2># Viewer</h2>
                    <p>This website contains an online viewer for spark profiles.</p>
                    <p>It is written using React, and open-source'd on GitHub. Any contributions are most welcome!</p>
                    <p>Uploaded content is stored centrally and retained for 60 days.</p>
                </div>
            )
            break
        case PAGE_NOT_FOUND:
            contents = <div className="banner-notice">404 - Page Not Found</div>
            break
        case LOADING_DATA:
            contents = <div className="banner-notice">Downloading...</div>
            break
        case PARSING_DATA:
            contents = <div className="banner-notice">Rendering...</div>
            break
        case FAILED_DATA:
            contents = <div className="banner-notice">Unable to load the data. Perhaps it expired? Are you using a recent version?</div>
            break
        case LOADED_PROFILE_DATA:
            contents = <Sampler data={loaded} mappings={mappings}/>
            break
        case LOADED_HEAP_DATA:
            contents = <Heap data={loaded}/>
            break
        default:
            contents = <div className="banner-notice">Unknown state - this is a bug.</div>
            break
    }
    return <>
        <Header isViewer={code} mappings={mappingsInfo} setMappings={onMappingsRequest} />
        {contents}
        <Footer />
    </>
}
