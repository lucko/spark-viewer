import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import bukkitLogo from '../assets/logos/bukkit.png';
import bungeeCordLogo from '../assets/logos/bungeecord.png';
import fabricLogo from '../assets/logos/fabric.png';
import forgeLogo from '../assets/logos/forge.png';
import neoForgeLogo from '../assets/logos/neoforge.png';
import spongeLogo from '../assets/logos/sponge.png';
import velocityLogo from '../assets/logos/velocity.png';
import TextBox from '../components/TextBox';
import useFetchResult, { Status } from '../hooks/useFetchResult';

import changelogStyles from '../style/changelog.module.scss';
import styles from '../style/downloads.module.scss';
import { ChangelogData, ChangelogEntry, ChangelogList } from './changelog';

interface JenkinsInfo {
    artifacts: JenkinsArtifact[];
    timestamp: number;
    url: string;
}

interface JenkinsArtifact {
    fileName: string;
    relativePath: string;
}

interface OldVersion {
    modloader: string;
    curseGameVersionTypeId: number;
    logo: StaticImageData;
    versions: string[];
}

const OLD_VERSIONS: OldVersion[] = [
    {
        modloader: 'Forge',
        curseGameVersionTypeId: 1,
        logo: forgeLogo,
        versions: [
            '1.20.6',
            '1.20.4',
            '1.19.4',
            '1.18.2',
            '1.17.1',
            '1.16.5',
            '1.12.2',
        ],
    },
    {
        modloader: 'Fabric',
        curseGameVersionTypeId: 4,
        logo: fabricLogo,
        versions: ['1.20.6', '1.20.4', '1.19.4', '1.18.2', '1.17.1', '1.16.5'],
    },
];

export default function Download() {
    const [info, status] = useFetchResult<JenkinsInfo>(
        `https://ci.lucko.me/job/spark/lastSuccessfulBuild/api/json?tree=url,timestamp,artifacts[fileName,relativePath]`
    );

    const [changelog] = useFetchResult<ChangelogData>(
        'https://sparkapi.lucko.me/changelog'
    );

    let content;
    if (status !== Status.ERROR) {
        content = <DownloadPage info={info} changelog={changelog} />;
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

interface ArtifactsMap {
    [key: string]: {
        fileName: string;
        url: string;
    };
}

const processJenkinsInfo = (
    info: JenkinsInfo | undefined
): [string, string, ArtifactsMap] => {
    const artifacts: ArtifactsMap = {};
    let version = 'unknown';
    const timestamp = info
        ? new Date(info?.timestamp).toLocaleString()
        : 'unknown';
    for (const { fileName, relativePath } of info?.artifacts || []) {
        const [v, platform] = fileName.slice(0, -4).split('-').slice(1);
        version = v;
        artifacts[platform] = {
            fileName,
            url: info!.url + 'artifact/' + relativePath,
        };
    }
    return [version, timestamp, artifacts];
};

const DownloadPage = ({
    info,
    changelog,
}: {
    info?: JenkinsInfo;
    changelog?: ChangelogData;
}) => {
    const [version, timestamp, artifacts] = processJenkinsInfo(info);
    const changelogSlice = changelog?.changelog?.slice(0, 5) || [];

    return (
        <>
            <p>
                The latest version of spark is{' '}
                <span className="version-number">v{version}</span>, which was
                created at {timestamp}.
            </p>
            <br />

            <DownloadButtons artifacts={artifacts} />

            <br />
            <p>
                Once you&apos;ve got spark installed, head over to the{' '}
                <a href="https://spark.lucko.me/docs">documentation</a> to learn
                how to use it!
            </p>
            <p className="caveat">
                Note: spark is pre-bundled with Paper 1.21+, so you don&apos;t
                need to install the plugin!
            </p>

            <h2>Recent Changes</h2>
            <RecentChangelog changelog={changelogSlice} />

            <h2>Other Platforms</h2>
            <p>
                spark is also available for other platforms, including Folia,
                Geyser, Minestom, and Nukkit. These releases are provided as-is
                and are supported by the community.
            </p>
            <p>
                For more info, please see{' '}
                <a href="https://github.com/lucko/spark-extra-platforms">
                    spark-extra-platforms
                </a>{' '}
                on GitHub. Downloads are available from{' '}
                <a href="https://ci.lucko.me/job/spark-extra-platforms/">
                    Jenkins
                </a>
                .
            </p>

            <h2>Older Versions</h2>
            <p>
                Releases for older Minecraft versions are listed below. These
                are not actively supported, but should still work ok :)
            </p>
            <OlderVersionsList versions={OLD_VERSIONS} />
            <p>(Note: The links above will open CurseForge.com in a new tab)</p>
        </>
    );
};

const RecentChangelog = ({ changelog }: { changelog: ChangelogEntry[] }) => {
    if (changelog.length === 0) {
        return <p>Loading...</p>;
    }

    return (
        <div className={changelogStyles.changelog}>
            <ChangelogList entries={changelog} />
            <p>
                And more! See the <Link href={'changelog'}>full changelog</Link>
                .
            </p>
        </div>
    );
};

const DownloadButtons = ({ artifacts }: { artifacts: ArtifactsMap }) => {
    return (
        <div className="download-buttons">
            <DownloadInfo
                artifacts={artifacts}
                name="Bukkit"
                comment="Paper/Spigot"
                artifact="bukkit"
                logo={bukkitLogo}
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
            <DownloadInfo
                artifacts={artifacts}
                name="Fabric"
                comment="MC 1.21"
                artifact="fabric"
                logo={fabricLogo}
            />
            <DownloadInfo
                artifacts={artifacts}
                name="Forge"
                comment="MC 1.21"
                artifact="forge"
                logo={forgeLogo}
            />
            <DownloadInfo
                artifacts={artifacts}
                name="NeoForge"
                comment="MC 1.21"
                artifact="neoforge"
                logo={neoForgeLogo}
            />
            <DownloadInfo
                artifacts={artifacts}
                name="Sponge"
                comment="API 8+"
                artifact="sponge"
                logo={spongeLogo}
            />
        </div>
    );
};

interface DownloadInfoProps {
    artifacts: ArtifactsMap;
    name: string;
    comment?: string;
    artifact: string;
    logo: StaticImageData;
}

const DownloadInfo = ({
    artifacts,
    name,
    comment,
    artifact,
    logo,
}: DownloadInfoProps) => {
    const { url } = Object.keys(artifacts).length
        ? artifacts[artifact]
        : { url: '#' };

    return (
        <a className="link" href={url}>
            <Image
                src={logo}
                style={{ objectFit: 'contain' }}
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

const OlderVersionsList = ({ versions }: { versions: OldVersion[] }) => {
    return (
        <div className="older-versions">
            {versions.map(oldVersion => {
                const getUrl = (version: string) => {
                    return `https://www.curseforge.com/minecraft/mc-mods/spark/files?gameVersionTypeId=${oldVersion.curseGameVersionTypeId}&version=${version}`;
                };

                return (
                    <div key={oldVersion.modloader}>
                        <h3>
                            <Image
                                src={oldVersion.logo}
                                style={{
                                    objectFit: 'contain',
                                    verticalAlign: 'middle',
                                }}
                                width={40}
                                height={40}
                                alt={oldVersion.modloader + ' logo'}
                            />{' '}
                            {oldVersion.modloader}
                        </h3>
                        <hr />
                        <ul>
                            {oldVersion.versions.map(version => (
                                <li key={version}>
                                    <a
                                        href={getUrl(version)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {version}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
};
