import { convertSeries, Metric, MetricProps } from '../Metric';
import MetricGraph from '../MetricGraph';

const doubleFormat = (value: number) => value.toFixed(2);

export default function TpsMetric({ metrics, timeRange }: MetricProps) {
    const tpsData = convertSeries(metrics.tps, v => v, timeRange);

    if (!tpsData) return null;

    return (
        <Metric title="TPS">
            <MetricGraph
                series={[{ name: 'TPS', data: tpsData, color: '#71E27D' }]}
                format={doubleFormat}
            />
        </Metric>
    );
}
