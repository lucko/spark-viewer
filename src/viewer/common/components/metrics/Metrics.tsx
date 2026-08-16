import { faLineChart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import styles from '../../../../style/metrics.module.scss';
import { Metrics as MetricsProto } from '../../../proto/spark_pb';
import TimeRangeSelect from './TimeRangeSelect';
import CpuMetric from './types/CpuMetric';
import MemoryAllocMetric from './types/MemoryAllocMetric';
import MemoryMetric from './types/MemoryMetric';
import MsptMetric from './types/MsptMetric';
import PlayerPingMetric from './types/PlayerPingMetric';
import TpsMetric from './types/TpsMetric';
import WorldMetric from './types/WorldMetric';

export interface MetricsProps {
    metrics: MetricsProto;
}

export default function Metrics({ metrics }: MetricsProps) {
    const [timeRange, setTimeRange] = useState<number>(15);

    return (
        <div className={styles.metrics}>
            <div className="header">
                <h2>
                    <FontAwesomeIcon icon={faLineChart} /> Metrics
                </h2>
                <div className="description">
                    <p>
                        This section displays various metrics related to the
                        application performance and resource usage.
                    </p>
                    <TimeRangeSelect
                        value={timeRange}
                        onChange={setTimeRange}
                    />
                </div>
            </div>

            <div className="metrics-container">
                <TpsMetric metrics={metrics} timeRange={timeRange} />
                <MsptMetric metrics={metrics} timeRange={timeRange} />
                <CpuMetric metrics={metrics} timeRange={timeRange} />
                <MemoryMetric metrics={metrics} timeRange={timeRange} />
                <MemoryAllocMetric metrics={metrics} timeRange={timeRange} />
                <WorldMetric metrics={metrics} timeRange={timeRange} />
                <PlayerPingMetric metrics={metrics} timeRange={timeRange} />
            </div>
        </div>
    );
}
