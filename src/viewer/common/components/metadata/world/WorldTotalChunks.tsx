import { WorldStatistics_World } from '../../../../proto/spark_pb';

interface ExtendedWorld extends WorldStatistics_World {
    totalChunks: number;
}

export interface WorldTotalChunksProps {
    worldsInput: WorldStatistics_World[];
}

export default function WorldTotalChunks({
    worldsInput,
}: WorldTotalChunksProps) {
    const worlds = worldsInput as ExtendedWorld[];

    for (const world of worlds) {
        world.totalChunks = world.regions.reduce(
            (acc, region) => acc + region.chunks.length,
            0
        );
    }

    const totalChunks = worlds.reduce(
        (acc, world) => acc + world.totalChunks,
        0
    );

    return (
        <>
            <p>
                <b>Chunks</b> (total): <span>{totalChunks}</span>
            </p>
            <ul>
                {worlds
                    .sort((a, b) => b.totalChunks - a.totalChunks)
                    .map(world => (
                        <li key={world.name}>
                            {world.name}: <span>{world.totalChunks}</span>
                        </li>
                    ))}
            </ul>
        </>
    );
}
