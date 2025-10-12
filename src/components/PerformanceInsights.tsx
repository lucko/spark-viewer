import { 
    faCheckCircle,
    faExclamationTriangle,
    faLightbulb,
    faRocket,
    faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useState } from 'react';
import styles from '../style/performance-insights.module.scss';

interface Insight {
    type: 'critical' | 'warning' | 'suggestion' | 'success';
    icon: any;
    title: string;
    description: string;
    action?: string;
}

interface PerformanceInsightsProps {
    profileData?: any;
}

export default function PerformanceInsights({ profileData }: PerformanceInsightsProps) {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [isExpanded, setIsExpanded] = useState(true);
    
    const generateInsights = useCallback((data: any) => {
        const newInsights: Insight[] = [];
        
        // Check TPS - handle different data structures
        const tps = data.tps || 
                    data.avgTps || 
                    data.metadata?.platformStatistics?.tps?.last1M ||
                    data.metadata?.platformStatistics?.tps?.last5M ||
                    data.metadata?.platformStatistics?.tps?.last15M;
        
        // Extract world statistics for context-aware recommendations
        const chunks = data.metadata?.platformStatistics?.world?.chunks?.total || 0;
        const entities = data.metadata?.platformStatistics?.world?.entities?.total || 0;
        const tileEntities = data.metadata?.platformStatistics?.world?.tileEntities?.total || 0;
        
        // Only show TPS status if we have actual data
        if (tps !== undefined && tps !== null) {
            if (tps < 15) {
                let action = 'Investigate performance bottlenecks';
                
                // Context-aware recommendations based on world stats
                if (chunks > 5000) {
                    action = `High chunk count detected (${chunks.toLocaleString()}). Consider reducing view distance or limiting chunk loaders`;
                } else if (entities > 2000) {
                    action = `High entity count detected (${entities.toLocaleString()}). Use entity clearing mods or reduce mob spawning`;
                } else if (tileEntities > 10000) {
                    action = `High tile entity count (${tileEntities.toLocaleString()}). Optimize automation systems and reduce machine density`;
                } else {
                    action = 'Check mod performance with Spark profiler, investigate heavy tick consumers';
                }
                
                newInsights.push({
                    type: 'critical',
                    icon: faTimesCircle,
                    title: 'Critical TPS Drop Detected',
                    description: `Server TPS is ${tps.toFixed(1)}, which is significantly below optimal levels.`,
                    action: action,
                });
            } else if (tps < 18) {
                let action = 'Monitor server performance';
                
                if (chunks > 3000) {
                    action = `Moderate chunk count (${chunks.toLocaleString()}). Consider optimizing chunk loading patterns`;
                } else if (entities > 1500) {
                    action = `Moderate entity count (${entities.toLocaleString()}). Monitor entity accumulation in farms`;
                }
                
                newInsights.push({
                    type: 'warning',
                    icon: faExclamationTriangle,
                    title: 'Below Optimal TPS',
                    description: `Server TPS is ${tps.toFixed(1)}. Players may experience lag.`,
                    action: action,
                });
            } else if (tps < 19.5) {
                newInsights.push({
                    type: 'suggestion',
                    icon: faLightbulb,
                    title: 'Slightly Below Optimal TPS',
                    description: `Server TPS is ${tps.toFixed(1)}. Minor optimization may help.`,
                });
            } else {
                newInsights.push({
                    type: 'success',
                    icon: faCheckCircle,
                    title: 'Healthy TPS',
                    description: `Server is running smoothly at ${tps.toFixed(1)} TPS.`,
                });
            }
        }
        
        // Check Memory Usage
        const memory = data.memory || data.metadata?.systemStatistics?.memory;
        if (memory && memory.total > 0) {
            const usagePercent = (memory.used / memory.total) * 100;
            if (usagePercent > 90) {
                newInsights.push({
                    type: 'critical',
                    icon: faTimesCircle,
                    title: 'Critical Memory Usage',
                    description: `Memory usage at ${usagePercent.toFixed(0)}%. Server may crash soon.`,
                    action: 'Increase allocated RAM or reduce loaded chunks',
                });
            } else if (usagePercent > 75) {
                newInsights.push({
                    type: 'warning',
                    icon: faExclamationTriangle,
                    title: 'High Memory Usage',
                    description: `Memory usage at ${usagePercent.toFixed(0)}%. Consider optimization.`,
                    action: 'Monitor for memory leaks in mods, check for chunk generation issues',
                });
            }
        }
        
        // Check for heavy mod counts (different from plugins)
        const mods = data.mods || data.metadata?.platform?.mods || [];
        if (mods.length > 100) {
            newInsights.push({
                type: 'warning',
                icon: faExclamationTriangle,
                title: 'High Mod Count',
                description: `Running ${mods.length} mods may impact performance.`,
                action: 'Review mod list for conflicts or redundant functionality',
            });
        } else if (mods.length > 150) {
            newInsights.push({
                type: 'suggestion',
                icon: faLightbulb,
                title: 'Moderate Mod Count',
                description: `${mods.length} mods loaded. Monitor for compatibility issues.`,
            });
        }
        
        // Check GC frequency
        const gcData = data.metadata?.systemStatistics?.gc;
        if (gcData && gcData.frequency > 10) {
            newInsights.push({
                type: 'warning',
                icon: faExclamationTriangle,
                title: 'Frequent Garbage Collection',
                description: 'High GC frequency detected, may cause lag spikes.',
                action: 'Tune JVM garbage collection parameters',
            });
        }
        
        // Check for chunk loading issues specific to modded servers
        if (chunks > 5000) {
            newInsights.push({
                type: 'warning',
                icon: faExclamationTriangle,
                title: 'High Chunk Count',
                description: `${chunks.toLocaleString()} chunks loaded. This significantly impacts performance.`,
                action: 'Review chunk loader placement, reduce view distance, or use FTB Chunks limits',
            });
        } else if (chunks > 3000) {
            newInsights.push({
                type: 'suggestion',
                icon: faLightbulb,
                title: 'Moderate Chunk Count',
                description: `${chunks.toLocaleString()} chunks loaded.`,
                action: 'Monitor chunk loading patterns, especially from quarries and chunk loaders',
            });
        }
        
        // Check entity counts with specific thresholds
        if (entities > 2000) {
            newInsights.push({
                type: 'warning',
                icon: faExclamationTriangle,
                title: 'High Entity Count',
                description: `${entities.toLocaleString()} entities loaded. This will impact TPS.`,
                action: 'Use entity management mods (Clumps, AI Improvements) or reduce mob farm sizes',
            });
        } else if (entities > 1500) {
            newInsights.push({
                type: 'suggestion',
                icon: faLightbulb,
                title: 'Moderate Entity Count',
                description: `${entities.toLocaleString()} entities loaded.`,
                action: 'Monitor entity accumulation in mob farms and spawners',
            });
        }
        
        // Check tile entity counts (machines, chests, etc.)
        if (tileEntities > 10000) {
            newInsights.push({
                type: 'warning',
                icon: faExclamationTriangle,
                title: 'High Tile Entity Count',
                description: `${tileEntities.toLocaleString()} tile entities loaded.`,
                action: 'Optimize automation, use more efficient machines, or spread bases across dimensions',
            });
        } else if (tileEntities > 5000) {
            newInsights.push({
                type: 'suggestion',
                icon: faLightbulb,
                title: 'Moderate Tile Entity Count',
                description: `${tileEntities.toLocaleString()} tile entities active.`,
                action: 'Consider condensing automation systems or using performance-friendly alternatives',
            });
        }
        
        // Modded server specific checks
        const platformName = data.metadata?.platform?.name?.toLowerCase() || data.platform?.name?.toLowerCase() || '';
        const isModded = platformName.includes('forge') || platformName.includes('fabric') || 
                        platformName.includes('neoforge') || platformName.includes('sponge');
        
        if (isModded) {
            // Memory check specific to modded servers
            const memory = data.memory || data.metadata?.systemStatistics?.memory;
            if (memory && memory.total > 0) {
                const totalGb = memory.total / 1024 / 1024 / 1024;
                const modCount = mods.length || 100; // Assume high mod count if not available
                
                if (totalGb < 6 && modCount > 100) {
                    newInsights.push({
                        type: 'warning',
                        icon: faExclamationTriangle,
                        title: 'Low Memory for Modded Server',
                        description: `Only ${totalGb.toFixed(1)}GB allocated for heavily modded server.`,
                        action: 'Allocate at least 8-10GB RAM for stable modded server performance',
                    });
                }
            }
            
            // Performance mod recommendations based on platform
            if (platformName.includes('forge') || platformName.includes('neoforge')) {
                newInsights.push({
                    type: 'suggestion',
                    icon: faLightbulb,
                    title: 'Forge Optimization',
                    description: 'Consider performance mods for Forge.',
                    action: 'Install: Embeddium/Rubidium, FerriteCore, ModernFix, Clumps, AI Improvements',
                });
            } else if (platformName.includes('fabric')) {
                newInsights.push({
                    type: 'suggestion',
                    icon: faLightbulb,
                    title: 'Fabric Optimization',
                    description: 'Consider performance mods for Fabric.',
                    action: 'Install: Sodium, Lithium, Starlight, FerriteCore, Krypton',
                });
            }
        }
        
        // Performance score
        const score = calculatePerformanceScore(data);
        if (score >= 90) {
            newInsights.unshift({
                type: 'success',
                icon: faRocket,
                title: `Performance Score: ${score}/100`,
                description: 'Server is performing excellently!',
            });
        } else if (score >= 75) {
            newInsights.unshift({
                type: 'suggestion',
                icon: faLightbulb,
                title: `Performance Score: ${score}/100`,
                description: 'Server performance is good but has room for improvement.',
            });
        } else if (score >= 50) {
            newInsights.unshift({
                type: 'warning',
                icon: faExclamationTriangle,
                title: `Performance Score: ${score}/100`,
                description: 'Server performance needs attention - players may experience lag.',
            });
        } else {
            newInsights.unshift({
                type: 'critical',
                icon: faTimesCircle,
                title: `Performance Score: ${score}/100`,
                description: 'Critical performance issues detected.',
            });
        }
        
        setInsights(newInsights);
    }, []);
    
    useEffect(() => {
        if (profileData) {
            generateInsights(profileData);
        }
    }, [profileData, generateInsights]);
    
    const calculatePerformanceScore = (data: any): number => {
        let score = 100;
        
        // Get actual TPS value - prefer 1m average
        const tps = data.tps || 
                    data.avgTps || 
                    data.metadata?.platformStatistics?.tps?.last1M ||
                    data.metadata?.platformStatistics?.tps?.last5M ||
                    data.metadata?.platformStatistics?.tps?.last15M;
        
        // TPS impact (most important factor)
        // Every TPS below 20 reduces score significantly
        if (tps !== undefined && tps !== null && tps < 20) {
            const tpsLoss = (20 - tps);
            score -= tpsLoss * 5; // -5 points per TPS lost
        }
        
        // Memory usage impact
        const memory = data.memory || data.metadata?.systemStatistics?.memory;
        if (memory && memory.total > 0) {
            const usagePercent = (memory.used / memory.total) * 100;
            if (usagePercent > 70) {
                score -= (usagePercent - 70) * 0.5; // -0.5 points per % over 70
            }
        }
        
        // CPU impact
        if (data.cpu && data.cpu > 0) {
            if (data.cpu > 70) {
                score -= (data.cpu - 70) * 0.3; // -0.3 points per % over 70
            }
        }
        
        // Mod count impact (less severe for modded servers)
        const mods = data.mods || data.metadata?.platform?.mods || [];
        if (mods.length > 200) {
            score -= (mods.length - 200) * 0.05; // Only penalize very excessive mod counts
        }
        
        // Entity count impact
        const entities = data.metadata?.platformStatistics?.world?.entities?.total || 0;
        if (entities > 2000) {
            score -= (entities - 2000) * 0.002; // -0.002 points per entity over 2000
        }
        
        // Chunk count impact
        const chunks = data.metadata?.platformStatistics?.world?.chunks?.total || 0;
        if (chunks > 5000) {
            score -= (chunks - 5000) * 0.001; // -0.001 points per chunk over 5000
        }
        
        return Math.max(0, Math.min(100, Math.round(score)));
    };
    
    if (insights.length === 0) {
        return null;
    }
    
    return (
        <div className={styles.insightsPanel}>
            <div className={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
                <h3>
                    <FontAwesomeIcon icon={faLightbulb} />
                    Performance Insights
                    <span className={styles.badge}>{insights.length}</span>
                </h3>
                <span className={styles.toggle}>
                    {isExpanded ? '−' : '+'}
                </span>
            </div>
            
            {isExpanded && (
                <div className={styles.insightsList}>
                    {insights.map((insight, index) => (
                        <div 
                            key={index} 
                            className={`${styles.insight} ${styles[insight.type]}`}
                        >
                            <div className={styles.icon}>
                                <FontAwesomeIcon icon={insight.icon} />
                            </div>
                            <div className={styles.content}>
                                <h4>{insight.title}</h4>
                                <p>{insight.description}</p>
                                {insight.action && (
                                    <div className={styles.action}>
                                        <strong>Action:</strong> {insight.action}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
