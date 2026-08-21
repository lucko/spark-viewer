import { convertSeries, Metric, MetricProps } from '../Metric';
import MetricGraph from '../MetricGraph';

const doubleFormat = (value: number) => value.toFixed(2);

export default function MsptMetric({ metrics, timeRange }: MetricProps) {
    const percentile95Data = convertSeries(
        metrics.tickDuration,
        v => v.percentile95,
        timeRange
    );
    const minData = convertSeries(metrics.tickDuration, v => v.min, timeRange);
    const maxData = convertSeries(metrics.tickDuration, v => v.max, timeRange);

    if (!percentile95Data || !minData || !maxData) return null;

    return (
        <Metric title="MSPT">
            <MetricGraph
                series={[
                    {
                        name: '95%ile',
                        data: percentile95Data,
                        color: '#E271D5',
                    },
                    { name: 'Min', data: minData, color: '#4E9BE6' },
                    { name: 'Max', data: maxData, color: '#E85D75' },
                ]}
                format={doubleFormat}
            />
        </Metric>
    );
}
