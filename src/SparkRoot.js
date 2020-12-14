import React, { useEffect, useState } from 'react';
import Pbf from 'pbf'
import { SamplerData } from './proto'
import { Sampler } from './types/Sampler';

import sparkLogo from './assets/spark-logo.png'

const NO_PROFILE_DATA = Symbol()
const LOADING_PROFILE_DATA = Symbol()
const PARSING_PROFILE_DATA = Symbol()
const FAIL_LOAD_PROFILE_DATA = Symbol()
const LOADED_PROFILE_DATA = Symbol()

function Header() {
    return (
        <div id="header">
            <img src={sparkLogo} alt="" width="32px" height="32px" />
            <h1 className="section">spark <span className="ignition-beta">ignition beta</span></h1>
        </div>
    )
}

function Footer() {
    return (
        <div id="footer">
            <a href="https://github.com/lucko/spark">spark</a> is based on <a href="http://github.com/sk89q/WarmRoast">WarmRoast</a> by sk89q.<br />
            <a href="https://github.com/astei/spark-ignition">spark-ignition</a> is &copy; 2020 Andrew Steinborn.
        </div>
    )
}

export default function SparkRoot() {
    const [status, setStatus] = useState(window.location.hash.startsWith('#') ? LOADING_PROFILE_DATA : NO_PROFILE_DATA)
    const [loaded, setLoaded] = useState(null)

    useEffect(() => {
        async function onLoad() {
            const hash = window.location.hash
            if (hash.startsWith('#')) {
                try {
                    const providedProfile = await fetch(`https://bytebin.lucko.me/${hash.substring(1)}`)
                    if (providedProfile.ok) {
                        if (providedProfile.headers.get('content-type') === 'application/x-spark-sampler') {
                            const profileData = await providedProfile.arrayBuffer()
                            setStatus(PARSING_PROFILE_DATA)
                            const data = new Pbf(new Uint8Array(profileData))
                            const deserialized = SamplerData.read(data)
                            setLoaded(deserialized)
                            setStatus(LOADED_PROFILE_DATA)
                        } else {
                            setStatus(FAIL_LOAD_PROFILE_DATA)
                        }
                    } else {
                        setStatus(FAIL_LOAD_PROFILE_DATA)
                    }
                } catch (e) {
                    setStatus(FAIL_LOAD_PROFILE_DATA)
                }
            }
        }

        onLoad()
    }, [])

    let contents
    switch (status) {
        case NO_PROFILE_DATA:
            contents = <div id="intro" style={{ textAlign: "center" }}>
                <p>To get started, download the <a href="https://github.com/lucko/spark">spark</a> plugin for your server, and run <code>/spark</code>.</p>
                <p>The latest versions of the plugin are <a href="https://ci.lucko.me/job/spark/">available on Jenkins</a>.</p>
            </div>
            break
        case LOADING_PROFILE_DATA:
            contents = <div id="loading">Downloading profile...</div>
            break
        case PARSING_PROFILE_DATA:
            contents = <div id="loading">Preparing to render profile...</div>
            break
        case FAIL_LOAD_PROFILE_DATA:
            contents = <div id="loading">Unable to load the profile data. Perhaps the data expired?</div>
            break
        case LOADED_PROFILE_DATA:
            contents = <Sampler data={loaded}/>
            break
        default:
            contents = <div id="loading">Unknown state - this is a bug.</div>
            break
    }
    return <>
        <Header />
        {contents}
        <Footer />
    </>
}