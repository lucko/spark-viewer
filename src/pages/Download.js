import { faArrowCircleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';

import TextBox from '../components/TextBox';

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

        (async () => {
            try {
                const req = await fetch(
                    `https://ci.lucko.me/job/spark/lastSuccessfulBuild/api/json?tree=url,timestamp,number,artifacts[fileName,relativePath],actions[lastBuiltRevision[SHA1]]`
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
        })();
    }, [status]);

    let content;
    if (status === WAITING) {
        content = <p>Please wait...</p>;
    } else if (status === OK) {
        content = <DownloadList info={info} />;
    } else {
        content = <TextBox>Error: unable to get version information.</TextBox>;
    }

    return (
        <article className="downloads">
            <h1>spark downloads</h1>
            {content}
        </article>
    );
}

const DownloadList = ({ info }) => {
    const artifacts = {};
    let version = 'unknown';
    for (const { fileName, relativePath } of info.artifacts) {
        const [v, platform] = fileName.slice(0, -4).split('-').slice(1);
        version = v;
        artifacts[platform] = {
            fileName,
            url: info.url + 'artifact/' + relativePath,
        };
    }

    let commitHash = 'nil';
    for (const action of info.actions) {
        if (action._class === 'hudson.plugins.git.util.BuildData') {
            commitHash = action?.lastBuiltRevision?.SHA1 || 'nil';
        }
    }

    return (
        <>
            <p>
                The latest version is{' '}
                <span className="version-number">v{version}</span> (build #
                {info.number}), which was created at{' '}
                {new Date(info.timestamp).toLocaleString()}.{' '}
            </p>
            <p>
                It is based on commit{' '}
                <a href={'https://github.com/lucko/spark/commit/' + commitHash}>
                    {'lucko/spark@' + commitHash.substring(0, 7)}
                </a>
                .
            </p>
            <br />

            <DownloadInfo
                artifacts={artifacts}
                name="Bukkit"
                artifact="bukkit"
                installDir="plugins"
                controls={{ '': 'spark' }}
            />
            <DownloadInfo
                artifacts={artifacts}
                name="Fabric"
                comment="MC 1.18"
                artifact="fabric"
                installDir="mods"
                controls={{
                    server: 'spark',
                    client: 'sparkc',
                }}
            />
            <DownloadInfo
                artifacts={artifacts}
                name="Forge"
                comment="MC 1.18"
                artifact="forge"
                installDir="mods"
                controls={{
                    server: 'spark',
                    client: 'sparkc',
                }}
            />
            <DownloadInfo
                artifacts={artifacts}
                name="Sponge"
                comment="API 6/7"
                artifact="sponge7"
                installDir="plugins"
                controls={{ '': 'spark' }}
            />
            <DownloadInfo
                artifacts={artifacts}
                name="Sponge"
                comment="API 8"
                artifact="sponge8"
                installDir="plugins"
                controls={{ '': 'spark' }}
            />
            <DownloadInfo
                artifacts={artifacts}
                name="Nukkit"
                artifact="nukkit"
                installDir="plugins"
                controls={{ '': 'spark' }}
            />
            <DownloadInfo
                artifacts={artifacts}
                name="BungeeCord"
                artifact="bungeecord"
                installDir="plugins"
                controls={{ '': 'sparkb' }}
            />
            <DownloadInfo
                artifacts={artifacts}
                name="Velocity"
                artifact="velocity"
                installDir="plugins"
                controls={{ '': 'sparkv' }}
            />

            <br />
            <p>
                Once you've got spark installed, head over to the{' '}
                <a href="https://spark.lucko.me/docs">documentation</a> to learn
                how to use it!
            </p>
            <p>
                Unless stated otherwise, the downloads on this page target the
                latest versions for each platform. Historic releases of spark
                (for older Minecraft versions) can be downloaded from{' '}
                <a href="https://www.curseforge.com/minecraft/mc-mods/spark">
                    CurseForge
                </a>
                .
            </p>
        </>
    );
};

const DownloadInfo = ({
    artifacts,
    name,
    comment,
    artifact,
    installDir,
    controls,
}) => {
    const { url } = artifacts[artifact];

    return (
        <a className="link" href={url}>
            <div className="link-title">
                <FontAwesomeIcon icon={faArrowCircleDown} />
                <h3>
                    {name}
                    {comment && <span> ({comment})</span>}
                </h3>
            </div>
            <ul className="link-description">
                <li>
                    Install: <code>/{installDir}/</code>
                </li>
                {Object.entries(controls).map(([type, cmd], i) => (
                    <li key={i}>
                        Command: <code>/{cmd}</code>
                        {type && ' (' + type + ')'}
                    </li>
                ))}
            </ul>
        </a>
    );
};
