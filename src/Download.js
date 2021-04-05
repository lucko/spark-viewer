import React, { useState, useEffect } from 'react';

import BannerNotice from './misc/BannerNotice';

const WAITING = Symbol();
const OK = Symbol();
const ERROR = Symbol();

export default function Download() {
    const [status, setStatus] = useState(WAITING);
    const [info, setInfo] = useState();

    useEffect(() => {
        if (status !== WAITING) {
            return;
        }

        async function getDownloadInfo() {
            try {
                const req = await fetch(
                    `https://ci.lucko.me/job/spark/lastSuccessfulBuild/api/json?tree=url,timestamp,artifacts[fileName,relativePath]`
                );
                if (!req.ok) {
                    setStatus(ERROR);
                    return;
                }

                setInfo(await req.json());
                setStatus(OK);
            } catch (e) {
                console.log(e);
                setStatus(ERROR);
            }
        }

        getDownloadInfo().then(_ => {});
    }, [status]);

    if (status === WAITING) {
        return (
            <BannerNotice>
                Obtaining the latest version information, please wait...
            </BannerNotice>
        );
    } else if (status === ERROR) {
        return (
            <BannerNotice>
                Error: unable to get version information.
            </BannerNotice>
        );
    }

    const artifacts = {};
    for (const { fileName, relativePath } of info.artifacts) {
        artifacts[fileName.slice(0, -4)] =
            info.url + 'artifact/' + relativePath;
    }

    return (
        <div className="page">
            <h1># spark downloads</h1>
            <p>Below are links to download the latest versions of spark.</p>

            <DownloadInfo
                artifacts={artifacts}
                name="Bukkit"
                artifact="spark"
                installDir="plugins"
            >
                <li>
                    Use <code>/spark</code> to control the plugin.
                </li>
            </DownloadInfo>

            <DownloadInfo
                artifacts={artifacts}
                name="Forge"
                artifact="spark-forge"
                installDir="mods"
            >
                <li>
                    Use <code>/spark</code> to control the mod. (server-side)
                </li>
                <li>
                    Use <code>/sparkc</code> to control the mod. (client-side)
                </li>
            </DownloadInfo>

            <DownloadInfo
                artifacts={artifacts}
                name="Fabric"
                artifact="spark-fabric"
                installDir="mods"
            >
                <li>
                    Use <code>/spark</code> to control the mod. (server-side)
                </li>
                <li>
                    Use <code>/sparkc</code> to control the mod. (client-side)
                </li>
            </DownloadInfo>

            <DownloadInfo
                artifacts={artifacts}
                name="Sponge"
                artifact="spark"
                installDir="plugins"
            >
                <li>
                    Use <code>/spark</code> to control the plugin.
                </li>
            </DownloadInfo>

            <DownloadInfo
                artifacts={artifacts}
                name="Nukkit"
                artifact="spark-nukkit"
                installDir="plugins"
            >
                <li>
                    Use <code>/spark</code> to control the plugin.
                </li>
            </DownloadInfo>

            <DownloadInfo
                artifacts={artifacts}
                name="BungeeCord"
                artifact="spark"
                installDir="plugins"
            >
                <li>
                    Use <code>/sparkb</code> to control the plugin.
                </li>
            </DownloadInfo>

            <DownloadInfo
                artifacts={artifacts}
                name="Velocity"
                artifact="spark-velocity"
                installDir="plugins"
            >
                <li>
                    Use <code>/sparkv</code> to control the plugin.
                </li>
            </DownloadInfo>

            <br />
            <p>
                Once you've got spark installed, head over to the{' '}
                <a href="https://spark.lucko.me/docs">documentation</a> to learn
                how to use it!
            </p>
        </div>
    );
}

const DownloadInfo = ({ artifacts, name, artifact, installDir, children }) => {
    return (
        <>
            <h3>{name}</h3>
            <ul>
                <li>
                    Download <a href={artifacts[artifact]}>{artifact}.jar</a>{' '}
                    and install it in <code>/{installDir}/</code>
                </li>
                {children}
            </ul>
        </>
    );
};
