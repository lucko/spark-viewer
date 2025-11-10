import Link from 'next/link';
import CDULogo from '../assets/cdu-logo.svg';
import styles from '../style/header.module.scss';

export interface HeaderProps {
    title?: string;
}

export default function Header({ title = 'spark @ PlayCDU' }: HeaderProps) {
    return (
        <header className={styles.header}>
            <Link href="/" className={styles.logo}>
                <CDULogo width="2.5em" height="2.5em" className={styles.logoIcon} />
                <div className={styles.logoText}>
                    <h1>{title}</h1>
                    <span className={styles.tagline}>Craft Down Under</span>
                </div>
            </Link>
        </header>
    );
}

export function HomepageHeader() {
    return (
        <div className={styles['homepage-header']}>
            <div className={styles['header-content']}>
                <div className={styles['logo-container']}>
                    <CDULogo className={styles['homepage-logo']} />
                    <div className={styles['logo-gradient']}></div>
                </div>
                <div className={styles['text-container']}>
                    <h1 className={styles['main-title']}>spark</h1>
                    <div className={styles['subtitle']}>
                        <span className={styles['playcdu-badge']}>PlayCDU Edition</span>
                    </div>
                    <div className={styles['description']}>
                        A performance profiler for Minecraft
                        <br />
                        clients, servers, and proxies.
                        <br />
                        <span className={styles['server-info']}>Optimized for Craft Down Under</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
