import FilePicker from '../components/FilePicker';

import NextLink from 'next/link';

import {
    faArrowCircleDown,
    faBook,
    faHeartbeat,
    faMemory,
    faMicrochip,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { HomepageHeader } from '../components/Header';
import SparkLayout from '../components/SparkLayout';
import { SelectedFileContext } from './_app';

import styles from '../style/homepage.module.scss';

export default function Index({ onFileSelected }) {
    const { setSelectedFile } = useContext(SelectedFileContext);
    const router = useRouter();

    function onFileSelected(file) {
        setSelectedFile(file);
        router.push('/_');
    }

    return (
        <article className={styles.homepage}>
            <Navigation />
            <AboutSection />
            <ViewerSection onFileSelected={onFileSelected} />
        </article>
    );
}

const Navigation = () => {
    return (
        <nav>
            <Link title="Downloads" icon={faArrowCircleDown} url="download">
                Download the latest version
                <br />
                of spark.
            </Link>
            <Link
                title="Documentation"
                icon={faBook}
                url="docs"
            >
                Read the documentation and
                <br />
                usage guides.
            </Link>
        </nav>
    );
};

const Link = ({ title, icon, url, children }) => {
    return (
        <NextLink href={url}>
            <a className="link">
                <div className="link-title">
                    <FontAwesomeIcon icon={icon} fixedWidth />
                    <h3>{title}</h3>
                </div>
                <div className="link-description">{children}</div>
            </a>
        </NextLink>
    );
};

const AboutSection = () => {
    return (
        <section>
            <h2>About</h2>
            <p>
                spark is a performance profiler, made up of three main
                components.
            </p>
            <AboutFeature title="Profiler" icon={faMicrochip}>
                spark can help to diagnose performance problems and bottlenecks
                with its built-in profiler.
            </AboutFeature>
            <AboutFeature title="Memory Inspection" icon={faMemory}>
                spark can produce full heap dumps, present a summary of what’s
                using the most memory, and monitor GC activity.
            </AboutFeature>
            <AboutFeature title="Health Reporting" icon={faHeartbeat}>
                spark monitors and reports a number of key metrics which are
                useful for tracking performance over time.
            </AboutFeature>

            <p>
                More information about spark can be found on{' '}
                <a href="https://github.com/lucko/spark">GitHub</a>, or you can
                come chat with us on{' '}
                <a href="https://discord.gg/PAGT2fu">Discord</a>.
            </p>
        </section>
    );
};

const AboutFeature = ({ title, icon, children }) => {
    return (
        <div className="feature">
            <FontAwesomeIcon icon={icon} fixedWidth />
            <div>
                <h3>{title}</h3>
                {children}
            </div>
        </div>
    );
};

const ViewerSection = ({ onFileSelected }) => {
    return (
        <section>
            <h2>Viewer</h2>
            <p>This website is also an online viewer for spark data.</p>
            <p>In order to use it:</p>
            <ol>
                <li>
                    Generate a{' '}
                    <a href="https://spark.lucko.me/docs/Command-Usage#spark-profiler">
                        profile
                    </a>{' '}
                    or{' '}
                    <a href="https://spark.lucko.me/docs/Command-Usage#spark-heapsummary">
                        heap summary
                    </a>{' '}
                    using the appropriate spark commands.
                </li>
                <li>
                    After the data has been uploaded, click the link to open the
                    viewer.
                </li>
            </ol>
            <p>
                You can also generate or export a <code>.sparkprofile</code> or{' '}
                <code>.sparkheap</code> file and open it by dragging it into the
                box below.
            </p>
            <FilePicker callback={onFileSelected} />
            <p>
                The website/viewer is written in JavaScript using the React
                framework, and open-source'd on GitHub. Pull requests are much
                appreciated!
            </p>
        </section>
    );
};

Index.getLayout = page => (
    <SparkLayout header={<HomepageHeader />}>{page}</SparkLayout>
);
