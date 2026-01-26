import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import RemoteReportsModal from './RemoteReportsModal';
import SparkLogo from '../assets/spark-logo.svg';

import styles from '../style/header.module.scss';

export interface HeaderProps {
    title?: string;
}

export default function Header({ title = 'spark' }: HeaderProps) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // 检查是否在查看器页面（有code参数或远程加载）
    const isViewerPage = router.pathname === '/[code]' || 
                         router.pathname === '/remote' || 
                         (router.query.code && router.query.code !== '_');

    return (
        <>
            <header className={styles.header}>
                <Link href="/" className="logo">
                    <SparkLogo width="2.5em" height="2.5em" />
                    <h1>{title}</h1>
                </Link>
                
                {isViewerPage && (
                    <div className={styles.controls}>
                        <button 
                            className={styles.remoteButton}
                            onClick={() => setIsModalOpen(true)}
                            title="打开远程报告库"
                        >
                            <span className={styles.buttonIcon}>📡</span>
                            <span className={styles.buttonText}>远程报告</span>
                        </button>
                    </div>
                )}
            </header>
            
            <RemoteReportsModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>
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
