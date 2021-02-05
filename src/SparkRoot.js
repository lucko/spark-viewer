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
            <img src={sparkLogo} alt="" width="32px" height="32px" />
            <h1 className="section">spark viewer</h1>
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
                <div id="intro" style={{ textAlign: "center" }}>
                    <p>To get started, download the <a href="https://github.com/lucko/spark">spark</a> plugin for your server, and run <code>/spark</code>.</p>
                    <p>The latest versions of the plugin are <a href="https://ci.lucko.me/job/spark/">available on Jenkins</a>.</p>
                </div>
            )
            break
        case LOADING_DATA:
            contents = <div id="loading">Downloading...</div>
            break
        case PARSING_DATA:
            contents = <div id="loading">Rendering...</div>
            break
        case FAILED_DATA:
            contents = <div id="loading">Unable to load the data. Perhaps it expired? Are you using a recent version?</div>
            break
        case LOADED_PROFILE_DATA:
            contents = <Sampler data={loaded} mappings={mappings}/>
            break
        case LOADED_HEAP_DATA:
            contents = <Heap data={loaded}/>
            break
        default:
            contents = <div id="loading">Unknown state - this is a bug.</div>
            break
    }
    return <>
        <Header mappings={mappingsInfo} setMappings={onMappingsRequest} />
        {contents}
        <Footer />
    </>
}
