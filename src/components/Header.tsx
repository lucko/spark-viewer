import Link from 'next/link';
import CDULogo from '../assets/cdu-logo.svg';

import styles from '../style/header.module.scss';

export interface HeaderProps {
    title?: string;
}

export default function Header({ title = 'spark @ PlayCDU' }: HeaderProps) {
    return (
        <header className={styles.header}>
            <Link href="/" className="logo">
                <CDULogo width="2.5em" height="2.5em" />
                <h1>{title}</h1>
            </Link>
        </header>
    );
}

export function HomepageHeader() {
    return (
        <div className={styles['homepage-header']}>
            <div>
                <CDULogo />
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
