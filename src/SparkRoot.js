import React, { useEffect, useState } from 'react';
import Pbf from 'pbf'
import { SamplerData, HeapData } from './proto'
import { Sampler, MappingsMenu } from './types/Sampler';
import { getMappingsInfo, requestMappings } from './mappings'
import { Heap } from './types/Heap';

import sparkLogo from './assets/spark-logo.png'

const NO_DATA = Symbol();
const LOADING_DATA = Symbol();
const PARSING_DATA = Symbol();
const FAILED_DATA = Symbol();
const LOADED_PROFILE_DATA = Symbol();
const LOADED_HEAP_DATA = Symbol();

function Header({ mappings, setMappings }) {
    return (
        <div id="header">
            <a href="/" id="logo">
                <img src={sparkLogo} alt="" width="32px" height="32px" />
                <h1>spark viewer</h1>
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
    const [status, setStatus] = useState(window.location.hash.startsWith('#') ? LOADING_DATA : NO_DATA);
    const [loaded, setLoaded] = useState(null);
    const [mappingsInfo, setMappingsInfo] = useState(null);
    const [mappings, setMappings] = useState({func: _ => {}});

    function onMappingsRequest(type) {
        requestMappings(type, mappingsInfo).then(func => {
            setMappings({ func });
        })
    }

    useEffect(() => {
        async function onLoad() {
            const hash = window.location.hash;
            if (hash.startsWith('#')) {
                try {
                    const req = await fetch(`https://bytebin.lucko.me/${hash.substring(1)}`);
                    if (req.ok) {
                        const type = req.headers.get('content-type');
                        if (type === 'application/x-spark-sampler') {
                            // request mappings metadata in the background
                            getMappingsInfo().then(setMappingsInfo);

                            const buf = await req.arrayBuffer();
                            setStatus(PARSING_DATA);
                            const pbf = new Pbf(new Uint8Array(buf));
                            const data = SamplerData.read(pbf);

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
                    } else {
                        setStatus(FAILED_DATA);
                    }
                } catch (e) {
                    setStatus(FAILED_DATA);
                }
            }
        }

        onLoad().then(_ => {});
    }, []);

    let contents;
    switch (status) {
        case NO_DATA:
            contents = (
                <div id="intro">
                    <h1># spark</h1>
                    <p>spark is a performance profiling plugin based on sk89q's <a href="https://github.com/sk89q/WarmRoast">WarmRoast profiler</a>.</p>
                    <p>spark is made up of three separate components:</p>
                    <ul>
                        <li><b>CPU Profiler</b>: Diagnose performance issues with your server.</li>
                        <li><b>Memory Inspection</b>: Diagnose memory issues with your server.</li>
                        <li><b>Server Health Reporting</b>: Keep track of your servers overall health.</li>
                    </ul>
                    <p>You can find out more about spark on <a href="https://github.com/lucko/spark">GitHub</a>.</p>
                    
                    <h2># Viewer</h2>
                    <p>This website is an online viewer for spark profiles. It is written using React, and open-source'd on GitHub. Any contributions are most welcome!</p>
                    <p>Uploaded content is stored centrally and retained for 30 days.</p>

                    <h2># Download</h2>
                    <p>You can always download the latest version of the plugin from <a href="https://ci.lucko.me/job/spark/">Jenkins</a>.</p>
                </div>
            )
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
        <Header mappings={mappingsInfo} setMappings={onMappingsRequest} />
        {contents}
        <Footer />
    </>
}
