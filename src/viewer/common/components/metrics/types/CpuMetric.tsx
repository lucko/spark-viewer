import { convertSeries, Metric, MetricProps } from '../Metric';
import MetricGraph from '../MetricGraph';

const percentFormat = (value: number) => `${(value * 100).toFixed(1)}%`;

export default function CpuMetric({ metrics, timeRange }: MetricProps) {
    const processData = convertSeries(
        metrics.cpuUsageProcess,
        v => v,
        timeRange
    );
    const systemData = convertSeries(metrics.cpuUsageSystem, v => v, timeRange);

    if (!processData || !systemData) return null;

    return (
        <Metric title="CPU">
            <MetricGraph
                series={[
                    { name: 'Process', data: processData, color: '#719DE2' },
                    { name: 'System', data: systemData, color: '#F7AD48' },
                ]}
                format={percentFormat}
            />
        </Metric>
    );
}
