import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';

dayjs.extend(relativeTime);

import TextBox from '../components/TextBox';

import Link from 'next/link';
import styles from '../style/changelog.module.scss';

const WAITING = 'waiting';
const OK = 'ok';
const ERROR = 'error';

export interface ChangelogData {
    changelog?: ChangelogEntry[];
}

export interface ChangelogEntry {
    version: string;
    timestamp: number;
    title: string;
    commit: string;
}

export default function Changelog() {
    const [status, setStatus] = useState(WAITING);
    const [info, setInfo] = useState<ChangelogData>();

    useEffect(() => {
        if (status !== WAITING) {
            return;
        }

        (async () => {
            try {
                const req = await fetch('https://sparkapi.lucko.me/changelog');
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
        content = <ChangelogList info={info!} />;
    } else {
        content = <TextBox>Error: unable to get changelog.</TextBox>;
    }

    return (
        <article className={styles.changelog}>
            <h1>Changelog</h1>
            {content}
        </article>
    );
}

const ChangelogList = ({ info }: { info: ChangelogData }) => {
    const changelog = info?.changelog || [];
    return (
        <>
            <p>
                The list below shows the most recent changes committed to the{' '}
                <a href="https://github.com/lucko/spark">
                    spark Git repository
                </a>
                .
            </p>
            <p>
                Go to the{' '}
                <Link href={'download'}>
                    <a>downloads</a>
                </Link>{' '}
                page to get the latest version.
            </p>
            <br />

            <ul>
                {changelog.map((entry, i) => (
                    <ChangelogItem key={i} entry={entry} />
                ))}
            </ul>
        </>
    );
};

const ChangelogItem = ({ entry }: { entry: ChangelogEntry }) => {
    return (
        <li>
            <span>
                <a
                    href={`https://github.com/lucko/spark/commit/${entry.commit}`}
                    target="_blank"
                >
                    <code>{entry.version}</code>
                </a>
                <span className="title">{entry.title}</span>
            </span>
            <span
                className="time"
                title={new Date(entry.timestamp * 1000).toString()}
            >
                {dayjs(entry.timestamp * 1000).fromNow()}
            </span>
        </li>
    );
};
