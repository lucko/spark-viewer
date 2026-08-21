import { formatBytesShort } from '../../../util/format';
import { convertSeries, Metric, MetricProps } from '../Metric';
import MetricGraph from '../MetricGraph';

const bytesPerSecondFormat = (value: number) =>
    `${formatBytesShort(value, 0)}/s`;

export default function MemoryAllocMetric({ metrics, timeRange }: MetricProps) {
    const data = convertSeries(metrics.memoryAllocation, v => v, timeRange);

    if (!data) return null;

    return (
        <Metric title="Memory" label="alloc">
            <MetricGraph
                series={[{ name: 'Bytes/sec', data: data, color: '#fc704f' }]}
                format={bytesPerSecondFormat}
            />
        </Metric>
    );
}
