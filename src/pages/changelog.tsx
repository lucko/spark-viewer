import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import TextBox from '../components/TextBox';
import { env } from '../env';
import useFetchResult, { Status } from '../hooks/useFetchResult';
import styles from '../style/changelog.module.scss';

dayjs.extend(relativeTime);

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
    const [info, status] = useFetchResult<ChangelogData>(
        `${env.NEXT_PUBLIC_SPARK_API_URL}/changelog`
    );

    let content;
    if (status !== Status.ERROR) {
        content = <ChangelogPage info={info} />;
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

const ChangelogPage = ({ info }: { info?: ChangelogData }) => {
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
                Go to the <Link href={'download'}>downloads</Link> page to get
                the latest version.
            </p>
            <br />
            <ChangelogList entries={changelog} />
        </>
    );
};

export const ChangelogList = ({ entries }: { entries: ChangelogEntry[] }) => {
    return (
        <ul>
            {entries.map((entry, i) => (
                <ChangelogItem key={i} entry={entry} />
            ))}
        </ul>
    );
};

const ChangelogItem = ({ entry }: { entry: ChangelogEntry }) => {
    return (
        <li>
            <span>
                <a
                    href={`https://github.com/lucko/spark/commit/${entry.commit}`}
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
