import Link from 'next/link';
import { useContext } from 'react';
import SparkLogoInverted from '../assets/spark-logo-inverted.svg';
import SparkLogo from '../assets/spark-logo.svg';
import { ThemeContext } from '../pages/_app';
import styles from '../style/header.module.scss';
import ThemeToggle from './ThemeToggle';

export interface HeaderProps {
    title?: string;
}

export default function Header({ title = 'spark' }: HeaderProps) {
    const [theme] = useContext(ThemeContext);
    const Logo = theme === 'dark' ? SparkLogo : SparkLogoInverted;

    return (
        <header className={styles.header}>
            <Link href="/" className="logo">
                <Logo width="2.5em" height="2.5em" />
                <h1>{title}</h1>
            </Link>
            <ThemeToggle />
        </header>
    );
}

export function HomepageHeader() {
    const [theme] = useContext(ThemeContext);
    const Logo = theme === 'dark' ? SparkLogo : SparkLogoInverted;

    return (
        <div className={styles['homepage-header']}>
            <div>
                <Logo />
                <div>
                    <h1>spark</h1>
                    <div>
                        A performance profiler for Minecraft
                        <br />
                        clients, servers, and proxies.
                    </div>
                </div>
            </div>
            <div className={styles['homepage-header-controls']}>
                <ThemeToggle />
            </div>
        </div>
    );
}
