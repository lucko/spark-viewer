import { WorldStatistics as WorldStatisticsProto } from '../../../../proto/spark_pb';
import EntityCountsList from './EntityCountsList';
import WorldTotalChunks from './WorldTotalChunks';
import WorldTotalEntities from './WorldTotalEntities';

export interface WorldSummaryProps {
    worldStatistics: WorldStatisticsProto;
}

export default function WorldSummary({ worldStatistics }: WorldSummaryProps) {
    return (
        <div>
            <div className="header">Summary</div>
            <div className="detail-lists">
                <div>
                    <WorldTotalEntities
                        totalEntities={worldStatistics.totalEntities}
                        worlds={worldStatistics.worlds}
                    />
                    <WorldTotalChunks worldsInput={worldStatistics.worlds} />
                </div>
                <div>
                    <p>
                        <b>Entity Counts</b>:
                    </p>
                    <EntityCountsList
                        entityCounts={worldStatistics.entityCounts}
                    />
                </div>
            </div>
        </div>
    );
}
