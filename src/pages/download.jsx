import { useEffect, useState } from 'react';

import TextBox from '../components/TextBox';

import Image from 'next/image';
import bukkitLogo from '../assets/logos/bukkit.png';
import bungeeCordLogo from '../assets/logos/bungeecord.png';
import fabricLogo from '../assets/logos/fabric.png';
import forgeLogo from '../assets/logos/forge.png';
import nukkitLogo from '../assets/logos/nukkit.png';
import spongeLogo from '../assets/logos/sponge.png';
import velocityLogo from '../assets/logos/velocity.png';

import styles from '../style/downloads.module.scss';

const WAITING = 'waiting';
const OK = 'ok';
const ERROR = 'error';

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
        })();
    }, [status]);

    let content;
    if (status === WAITING || status === OK) {
        content = <DownloadList info={info} />;
    } else {
        content = <TextBox>Error: unable to get version information.</TextBox>;
    }

    return (
        <article className={styles.downloads}>
            <h1>Downloads</h1>
            {content}
        </article>
    );
}

const DownloadList = ({ info }) => {
    const artifacts = {};
    let version = 'unknown';
    for (const { fileName, relativePath } of info?.artifacts || []) {
        const [v, platform] = fileName.slice(0, -4).split('-').slice(1);
        version = v;
        artifacts[platform] = {
            fileName,
            url: info.url + 'artifact/' + relativePath,
        };
    }

    return (
        <>
            {info?.artifacts && (
                <p>
                    The latest version of spark is{' '}
                    <span className="version-number">v{version}</span>, which
                    was created at {new Date(info.timestamp).toLocaleString()}.
                </p>
            )}
            <p>
                Use the links below to download the jar for your
                server/client/proxy!
            </p>
            <br />

            <div className="download-buttons">
                <DownloadInfo
                    artifacts={artifacts}
                    name="Bukkit"
                    artifact="bukkit"
                    logo={bukkitLogo}
                />
                <DownloadInfo
                    artifacts={artifacts}
                    name="Fabric"
                    comment="MC 1.19"
                    artifact="fabric"
                    logo={fabricLogo}
                />
                <DownloadInfo
                    artifacts={artifacts}
                    name="Forge"
                    comment="MC 1.19"
                    artifact="forge"
                    logo={forgeLogo}
                />
                <DownloadInfo
                    artifacts={artifacts}
                    name="Sponge"
                    comment="API 6/7"
                    artifact="sponge7"
                    logo={spongeLogo}
                />
                <DownloadInfo
                    artifacts={artifacts}
                    name="Sponge"
                    comment="API 8"
                    artifact="sponge8"
                    logo={spongeLogo}
                />
                <DownloadInfo
                    artifacts={artifacts}
                    name="Nukkit"
                    artifact="nukkit"
                    logo={nukkitLogo}
                />
                <DownloadInfo
                    artifacts={artifacts}
                    name="BungeeCord"
                    artifact="bungeecord"
                    logo={bungeeCordLogo}
                />
                <DownloadInfo
                    artifacts={artifacts}
                    name="Velocity"
                    artifact="velocity"
                    logo={velocityLogo}
                />
            </div>

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

const DownloadInfo = ({ artifacts, name, comment, artifact, logo }) => {
    const { url } = Object.keys(artifacts).length
        ? artifacts[artifact]
        : { url: '#' };

    return (
        <a className="link" href={url}>
            <Image
                src={logo}
                objectFit="contain"
                width={50}
                height={50}
                alt={name + ' logo'}
            />
            <div className="link-title">
                <div className="link-name">
                    <h3>{name}</h3>
                    {comment && <span> ({comment})</span>}
                </div>
            </div>
        </a>
    );
};
