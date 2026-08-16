import { convertSeries, Metric, MetricProps } from '../Metric';
import MetricGraph from '../MetricGraph';

const intFormat = (value: number) => value.toFixed(0);

export default function WorldMetric({ metrics, timeRange }: MetricProps) {
    const playersData = convertSeries(
        metrics.worldInfo,
        v => v.players,
        timeRange
    );
    const entitiesData = convertSeries(
        metrics.worldInfo,
        v => v.entities,
        timeRange
    );
    const tileEntitiesData = convertSeries(
        metrics.worldInfo,
        v => v.tileEntities,
        timeRange
    );
    const chunksData = convertSeries(
        metrics.worldInfo,
        v => v.chunks,
        timeRange
    );

    if (!playersData || !entitiesData || !tileEntitiesData || !chunksData)
        return null;

    return (
        <Metric title="World">
            <MetricGraph
                series={[
                    { name: 'Players', data: playersData, color: '#b72c7d' },
                    { name: 'Entities', data: entitiesData, color: '#fc704f' },
                    {
                        name: 'Tile Entities',
                        data: tileEntitiesData,
                        color: '#addcff',
                    },
                    { name: 'Chunks', data: chunksData, color: '#a1a1a1' },
                ]}
                format={intFormat}
            />
        </Metric>
    );
}
