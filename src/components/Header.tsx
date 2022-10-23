import Link from 'next/link';
import SparkLogo from '../assets/spark-logo.svg';

import { ReactNode } from 'react';
import styles from '../style/header.module.scss';

export interface HeaderProps {
    children?: ReactNode;
    title?: string;
}

export default function Header({ children, title = 'spark' }: HeaderProps) {
    return (
        <header className={styles.header}>
            <Link href="/">
                <a className="logo">
                    <SparkLogo width="2.5em" height="2.5em" />
                    <h1>{title}</h1>
                </a>
            </Link>
            {children}
        </header>
    );
}

export function HomepageHeader() {
    return (
        <div className={styles['homepage-header']}>
            <div>
                <SparkLogo />
                <div>
                    <h1>spark</h1>
                    <div>
                        A performance profiler for Minecraft
                        <br />
                        clients, servers, and proxies.
                    </div>
                </div>
            </div>
        </div>
    );
}
