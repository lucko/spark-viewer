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
        content = (
            <BannerNotice>
                Error: unable to get version information.
            </BannerNotice>
        );
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
    for (const { fileName, relativePath } of info.artifacts) {
        artifacts[fileName.slice(0, -4)] =
            info.url + 'artifact/' + relativePath;
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
                The latest version is build <b>#{info.number}</b>, which was
                created at {new Date(info.timestamp).toLocaleString()}.{' '}
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
                artifact="spark"
                installDir="plugins"
                controls={{ spark: 'plugin' }}
            />
            <DownloadInfo
                artifacts={artifacts}
                name="Fabric"
                artifact="spark-fabric"
                installDir="mods"
                controls={{
                    spark: 'mod (server-side)',
                    sparkc: 'mod (client-side)',
                }}
            />
            <DownloadInfo
                artifacts={artifacts}
                name="Forge"
                artifact="spark-forge"
                installDir="mods"
                controls={{
                    spark: 'mod (server-side)',
                    sparkc: 'mod (client-side)',
                }}
            />
            <DownloadInfo
                artifacts={artifacts}
                name="Forge"
                comment="MC 1.12.2"
                artifact="spark-forge1122"
                installDir="mods"
                controls={{
                    spark: 'mod (server-side)',
                    sparkc: 'mod (client-side)',
                }}
            />
            <DownloadInfo
                artifacts={artifacts}
                name="Sponge"
                comment="API 6/7"
                artifact="spark"
                installDir="plugins"
                controls={{ spark: 'plugin' }}
            />
            <DownloadInfo
                artifacts={artifacts}
                name="Sponge"
                comment="API 8"
                artifact="spark-sponge8"
                installDir="plugins"
                controls={{ spark: 'plugin' }}
            />
            <DownloadInfo
                artifacts={artifacts}
                name="Nukkit"
                artifact="spark-nukkit"
                installDir="plugins"
                controls={{ spark: 'plugin' }}
            />
            <DownloadInfo
                artifacts={artifacts}
                name="BungeeCord"
                artifact="spark"
                installDir="plugins"
                controls={{ sparkb: 'plugin' }}
            />
            <DownloadInfo
                artifacts={artifacts}
                name="Velocity"
                artifact="spark-velocity"
                installDir="plugins"
                controls={{ sparkv: 'plugin' }}
            />

            <br />
            <p>
                Once you've got spark installed, head over to the{' '}
                <a href="https://spark.lucko.me/docs">documentation</a> to learn
                how to use it!
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
    return (
        <section>
            <h3>
                {name}
                {comment && <span> ({comment})</span>}
            </h3>
            <ul>
                <li>
                    Download <a href={artifacts[artifact]}>{artifact}.jar</a>{' '}
                    and install it in <code>/{installDir}/</code>.
                </li>
                {Object.entries(controls).map(([cmd, type]) => (
                    <li key={cmd}>
                        Use <code>/{cmd}</code> to control the {type}.
                    </li>
                ))}
            </ul>
        </section>
    );
};
