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
import { ReactNode, useContext, useCallback } from 'react';
import { HomepageHeader } from '../components/Header';
import SparkLayout from '../components/SparkLayout';
import { NextPageWithLayout, SelectedFileContext } from './_app';
import useRemoteReports from '../hooks/useRemoteReports';

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { env } from '../env';
import styles from '../style/homepage.module.scss';

const Index: NextPageWithLayout = () => {
    const { setSelectedFile } = useContext(SelectedFileContext);
    const router = useRouter();

    function onFileSelected(file: File) {
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
};

const Navigation = () => {
    return (
        <nav>
            <Link title="Downloads" icon={faArrowCircleDown} url="download">
                Download the latest version of spark.
            </Link>
            <Link title="Documentation" icon={faBook} url="docs">
                Read the documentation and usage guides.
            </Link>
        </nav>
    );
};

interface LinkProps {
    title: string;
    icon: IconProp;
    url: string;
    children: ReactNode;
}

const Link = ({ title, icon, url, children }: LinkProps) => {
    return (
        <NextLink href={url} className="link">
            <div className="link-title">
                <FontAwesomeIcon icon={icon} fixedWidth />
                <h3>{title}</h3>
            </div>
            <div className="link-description">{children}</div>
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

            <RemoteReportsSelector />

            <p>
                More information about spark can be found on{' '}
                <a href="https://github.com/lucko/spark">GitHub</a>, or you can
                come chat with us on{' '}
                <a href="https://discord.gg/PAGT2fu">Discord</a>.
            </p>
        </section>
    );
};

interface AboutFeatureProps {
    title: string;
    icon: IconProp;
    children: ReactNode;
}

const AboutFeature = ({ title, icon, children }: AboutFeatureProps) => {
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

const ViewerSection = ({
    onFileSelected,
}: {
    onFileSelected: (file: File) => void;
}) => {
    return (
        <section>
            <h2>Viewer</h2>
            <p>This website is also an online viewer for spark data.</p>
            <p>In order to use it:</p>
            <ol>
                <li>
                    Generate a{' '}
                    <a
                        href={`${env.NEXT_PUBLIC_SPARK_BASE_URL}/docs/Command-Usage#spark-profiler`}
                    >
                        profile
                    </a>{' '}
                    or{' '}
                    <a
                        href={`${env.NEXT_PUBLIC_SPARK_BASE_URL}/docs/Command-Usage#spark-heapsummary`}
                    >
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
                framework, and open-source&apos;d on GitHub. Pull requests are
                much appreciated!
            </p>
        </section>
    );
};

const RemoteReportsSelector = () => {
    const router = useRouter();
    const { reports, isLoading, isError } = useRemoteReports();

    const handleRemoteReportSelect = useCallback(
        (event: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedValue = event.target.value;
            if (selectedValue) {
                router.push(`/remote?path=${encodeURIComponent(selectedValue)}`);
            }
        },
        [router]
    );

    return (
        <div className={styles['remote-reports-section']}>
            <h3>历史报告查看</h3>
            <p>快速查看之前生成的性能分析报告。</p>
            <div className={styles['remote-selector-container']}>
                <select 
                    className={styles['remote-select']}
                    onChange={handleRemoteReportSelect}
                    disabled={isLoading}
                    defaultValue=""
                >
                    <option value="">
                        {isLoading ? '正在加载历史报告...' : isError ? '无法加载历史报告' : '选择一个历史报告'}
                    </option>
                    {reports.map(report => (
                        <option key={report.key} value={report.downloadPath}>
                            {new Date(report.uploaded).toLocaleString('zh-CN')} - {report.sizeMB}
                        </option>
                    ))}
                </select>
                {!isLoading && !isError && reports.length > 0 && (
                    <p className={styles['remote-hint']}>选择报告后将自动加载和分析数据</p>
                )}
            </div>
        </div>
    );
};

Index.getLayout = page => (
    <SparkLayout header={<HomepageHeader />}>{page}</SparkLayout>
);

export default Index;
