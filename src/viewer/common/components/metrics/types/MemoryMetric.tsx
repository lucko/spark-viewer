import { formatBytesShort } from '../../../util/format';
import { convertSeries, Metric, MetricProps } from '../Metric';
import MetricGraph from '../MetricGraph';

const memoryFormat = (value: number) => formatBytesShort(value, 0);

export default function MemoryMetric({ metrics, timeRange }: MetricProps) {
    const usedData = convertSeries(
        metrics.memoryUsageHeap,
        v => v.used,
        timeRange
    );
    const maxData = convertSeries(
        metrics.memoryUsageHeap,
        v => v.max,
        timeRange
    );
    const committedData = convertSeries(
        metrics.memoryUsageHeap,
        v => v.committed,
        timeRange
    );

    if (!usedData || !maxData || !committedData) return null;

    return (
        <Metric title="Memory" label="heap">
            <MetricGraph
                series={[
                    { name: 'Used', data: usedData, color: '#fc704f' },
                    { name: 'Max', data: maxData, color: '#C94F3D' },
                    {
                        name: 'Committed',
                        data: committedData,
                        color: '#F9A58F',
                    },
                ]}
                format={memoryFormat}
            />
        </Metric>
    );
}
