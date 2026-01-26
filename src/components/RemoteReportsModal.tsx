import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import useRemoteReports from '../hooks/useRemoteReports';
import styles from '../style/remote-reports-modal.module.scss';

interface RemoteReportsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RemoteReportsModal({ isOpen, onClose }: RemoteReportsModalProps) {
    const router = useRouter();
    const { reports, isLoading, isError } = useRemoteReports();
    const [selectedReport, setSelectedReport] = useState<string>('');

    const handleReportSelect = useCallback(
        (downloadPath: string) => {
            if (downloadPath) {
                onClose();
                router.push(`/remote?path=${encodeURIComponent(downloadPath)}`);
            }
        },
        [router, onClose]
    );

    const handleOverlayClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>远程报告库</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        ✕
                    </button>
                </div>
                
                <div className={styles.content}>
                    {isLoading && (
                        <div className={styles.loading}>
                            <div className={styles.loadingSpinner}></div>
                            <p>正在加载远程报告...</p>
                        </div>
                    )}
                    
                    {isError && (
                        <div className={styles.error}>
                            <p>无法连接到远程报告服务器</p>
                        </div>
                    )}
                    
                    {!isLoading && !isError && reports.length === 0 && (
                        <div className={styles.empty}>
                            <p>暂无可用的远程报告</p>
                        </div>
                    )}
                    
                    {!isLoading && !isError && reports.length > 0 && (
                        <div className={styles.reportsList}>
                            <div className={styles.listHeader}>
                                <span>生成时间</span>
                                <span>文件大小</span>
                                <span>操作</span>
                            </div>
                            {reports.map(report => (
                                <div key={report.key} className={styles.reportItem}>
                                    <span className={styles.timestamp}>
                                        {new Date(report.uploaded).toLocaleString('zh-CN')}
                                    </span>
                                    <span className={styles.size}>
                                        {report.sizeMB}
                                    </span>
                                    <button 
                                        className={styles.loadButton}
                                        onClick={() => handleReportSelect(report.downloadPath)}
                                    >
                                        加载
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}