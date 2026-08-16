import { convertSeries, Metric, MetricProps } from '../Metric';
import MetricGraph from '../MetricGraph';

const intFormat = (value: number) => value.toFixed(0);

export default function PlayerPingMetric({ metrics, timeRange }: MetricProps) {
    const meanData = convertSeries(metrics.playerPing, v => v.mean, timeRange);
    const medianData = convertSeries(
        metrics.playerPing,
        v => v.median,
        timeRange
    );
    const minData = convertSeries(metrics.playerPing, v => v.min, timeRange);

    if (!meanData || !medianData || !minData) return null;

    return (
        <Metric title="Player Ping">
            <MetricGraph
                series={[
                    { name: 'Mean', data: meanData, color: '#ffdc50' },
                    { name: 'Median', data: medianData, color: '#E271D5' },
                    { name: 'Min', data: minData, color: '#4E9BE6' },
                ]}
                format={intFormat}
            />
        </Metric>
    );
}
