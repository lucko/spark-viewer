import { WorldStatistics as WorldStatisticsProto } from '../../../proto/spark_pb';
import WorldRegionSummary from './world/WorldRegionSummary';
import WorldSummary from './world/WorldSummary';

export interface WorldStatisticsProps {
    worldStatistics: WorldStatisticsProto;
}

export default function WorldStatistics({
    worldStatistics,
}: WorldStatisticsProps) {
    return (
        <div className="entity-counts">
            <WorldSummary worldStatistics={worldStatistics} />
            <WorldRegionSummary worlds={worldStatistics.worlds} />
        </div>
    );
}
