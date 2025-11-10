import { faChartLine, faClock, faMemory, faServer, faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import styles from '../style/quick-stats.module.scss';

interface QuickStat {
    icon: any;
    label: string;
    value: string | number;
    subValue?: string;
    status?: 'good' | 'warning' | 'critical';
}

interface ProfileQuickStatsProps {
    profileData?: any;
}

export default function ProfileQuickStats({ profileData }: ProfileQuickStatsProps) {
    const [stats, setStats] = useState<QuickStat[]>([]);

    useEffect(() => {
        if (profileData) {
            // Extract key metrics from profile data
            const newStats: QuickStat[] = [];

            // Server/Platform info
            if (profileData.platform) {
                newStats.push({
                    icon: faServer,
                    label: 'Platform',
                    value: profileData.platform.name,
                    subValue: profileData.platform.version,
                });
            }

            // Duration
            if (profileData.duration) {
                const seconds = Math.round(profileData.duration / 1000);
                newStats.push({
                    icon: faClock,
                    label: 'Profile Duration',
                    value: seconds > 0 ? `${seconds}s` : 'N/A',
                    subValue: profileData.ticks ? `${profileData.ticks} ticks` : '',
                });
            }

            // Memory usage
            if (profileData.memory && profileData.memory.total > 0) {
                const usedMb = Math.round(profileData.memory.used / 1024 / 1024);
                const totalMb = Math.round(profileData.memory.total / 1024 / 1024);
                const percentage = totalMb > 0 ? Math.round((usedMb / totalMb) * 100) : 0;
                
                newStats.push({
                    icon: faMemory,
                    label: 'Memory Usage',
                    value: `${usedMb} MB`,
                    subValue: totalMb > 0 ? `${percentage}% of ${totalMb} MB` : '',
                    status: percentage > 90 ? 'critical' : percentage > 75 ? 'warning' : 'good',
                });
            }

            // TPS/Performance
            if (profileData.tps !== undefined && profileData.tps !== null) {
                const tps = profileData.tps;
                newStats.push({
                    icon: faChartLine,
                    label: 'Average TPS',
                    value: tps.toFixed(1),
                    subValue: tps < 18 ? 'Performance issues detected' : 'Running smoothly',
                    status: tps < 15 ? 'critical' : tps < 18 ? 'warning' : 'good',
                });
            } else if (profileData.metadata?.platformStatistics?.tps) {
                // Fallback to any available TPS data
                const tpsData = profileData.metadata.platformStatistics.tps;
                const tps = tpsData.last1M || tpsData.last5M || tpsData.last15M;
                if (tps) {
                    newStats.push({
                        icon: faChartLine,
                        label: 'Average TPS (1m)',
                        value: tps.toFixed(1),
                        subValue: tps < 18 ? 'Performance issues detected' : 'Running smoothly',
                        status: tps < 15 ? 'critical' : tps < 18 ? 'warning' : 'good',
                    });
                }
            }

            // CPU Usage
            if (profileData.cpu !== undefined && profileData.cpu > 0) {
                newStats.push({
                    icon: faChartLine,
                    label: 'CPU Usage',
                    value: `${profileData.cpu.toFixed(1)}%`,
                    subValue: profileData.cpu > 80 ? 'High CPU usage' : 'Normal',
                    status: profileData.cpu > 90 ? 'critical' : profileData.cpu > 70 ? 'warning' : 'good',
                });
            }

            setStats(newStats);
        }
    }, [profileData]);

    if (stats.length === 0) {
        return null;
    }

    return (
        <div className={styles.quickStats}>
            <h2>Profile Overview</h2>
            <div className={styles.statsGrid}>
                {stats.map((stat, index) => (
                    <div 
                        key={index} 
                        className={`${styles.statCard} ${stat.status ? styles[stat.status] : ''}`}
                    >
                        <div className={styles.icon}>
                            <FontAwesomeIcon icon={stat.icon} />
                        </div>
                        <div className={styles.content}>
                            <div className={styles.label}>{stat.label}</div>
                            <div className={styles.value}>{stat.value}</div>
                            {stat.subValue && (
                                <div className={styles.subValue}>{stat.subValue}</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
