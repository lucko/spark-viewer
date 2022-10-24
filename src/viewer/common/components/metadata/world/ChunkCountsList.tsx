import { WorldStatistics_Chunk } from '../../../../proto/spark_pb';

export interface ChunkCountsListProps {
    chunks: WorldStatistics_Chunk[];
}

export default function ChunkCountsList({ chunks }: ChunkCountsListProps) {
    const chunksToDisplay = chunks.slice(0, 10);
    const more = chunks.length - 10;

    return (
        <ul>
            {chunksToDisplay.map(chunk => (
                <li key={`${chunk.x},${chunk.z}`}>
                    <span>
                        {chunk.x}, {chunk.z}
                    </span>{' '}
                    ({chunk.totalEntities}{' '}
                    {chunk.totalEntities === 1 ? 'entity' : 'entities'})
                </li>
            ))}
            {more > 0 && (
                <li style={{ listStyleType: 'none' }}>... and {more} more</li>
            )}
        </ul>
    );
}
