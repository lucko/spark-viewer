import { WorldStatistics_World } from '../../../../proto/spark_pb';

export interface WorldTotalEntitiesProps {
    totalEntities: number;
    worlds: WorldStatistics_World[];
}

export default function WorldTotalEntities({
    totalEntities,
    worlds,
}: WorldTotalEntitiesProps) {
    return (
        <>
            <p>
                <b>Entities</b> (total): <span>{totalEntities}</span>
            </p>
            <ul>
                {worlds
                    .sort((a, b) => b.totalEntities - a.totalEntities)
                    .map(world => (
                        <li key={world.name}>
                            {world.name}: <span>{world.totalEntities}</span>
                        </li>
                    ))}
            </ul>
        </>
    );
}
