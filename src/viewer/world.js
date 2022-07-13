import React, { Suspense, useMemo, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBackwardStep,
    faForwardStep,
} from '@fortawesome/free-solid-svg-icons';

const MinecraftIcon = React.lazy(() => import('../components/MinecraftIcon'));

export function WorldStatistics({ worldStatistics }) {
    return (
        <div className="entity-counts">
            <WorldSummary worldStatistics={worldStatistics} />
            <WorldRegionSummary worlds={worldStatistics.worlds} />
        </div>
    );
}

const WorldSummary = ({ worldStatistics }) => {
    return (
        <div>
            <div className="header">Summary</div>
            <div className="detail-lists">
                <div>
                    <WorldTotalEntities
                        totalEntities={worldStatistics.totalEntities}
                        worlds={worldStatistics.worlds}
                    />
                    <WorldTotalChunks worlds={worldStatistics.worlds} />
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
};

const WorldTotalEntities = ({ totalEntities, worlds }) => {
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
};

const WorldTotalChunks = ({ worlds }) => {
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
};

const WorldRegionSummary = ({ worlds }) => {
    const regions = useMemo(() => {
        const regions = [];
        for (const world of worlds) {
            for (const region of world.regions) {
                region.world = world.name;
                region.chunks.sort((a, b) => b.totalEntities - a.totalEntities);
                regions.push(region);
            }
        }
        regions.sort((a, b) => b.totalEntities - a.totalEntities);
        return regions;
    }, [worlds]);

    const [regionIdx, setRegionIdx] = useState(0);

    const region = useMemo(() => regions[regionIdx], [regions, regionIdx]);

    const combinedEntities = useMemo(() => {
        const combinedEntities = {};
        for (const chunk of region.chunks) {
            for (const [name, count] of Object.entries(chunk.entityCounts)) {
                if (!combinedEntities[name]) {
                    combinedEntities[name] = 0;
                }
                combinedEntities[name] += count;
            }
        }
        return combinedEntities;
    }, [region]);

    function previous() {
        setRegionIdx(prev => (prev - 1 + regions.length) % regions.length);
    }

    function next() {
        setRegionIdx(prev => (prev + 1) % regions.length);
    }

    return (
        <div className="region-view">
            <div className="header region-selector">
                <div className="button" onClick={previous} title="Previous">
                    <FontAwesomeIcon icon={faBackwardStep} />
                </div>
                <span>
                    Region #{regionIdx + 1} (of {regions.length})
                </span>
                <div className="button" onClick={next} title="Next">
                    <FontAwesomeIcon icon={faForwardStep} />
                </div>
            </div>
            <div className="detail-lists">
                <div>
                    <p>
                        <b>Entities</b> (<span>{region.totalEntities}</span>):
                    </p>
                    <EntityCountsList entityCounts={combinedEntities} />
                </div>
                <div>
                    <p>
                        <b>World</b>: {region.world}
                    </p>
                    <br />
                    <p>
                        <b>Chunks</b> (<span>{region.chunks.length}</span>):
                    </p>
                    <ChunkCountsList chunks={region.chunks} />
                </div>
            </div>
        </div>
    );
};

const ChunkCountsList = ({ chunks }) => {
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
};

const EntityCountsList = ({ entityCounts }) => {
    const entries = Object.entries(entityCounts).sort((a, b) => b[1] - a[1]);
    const entriesToDisplay = entries.slice(0, 15);

    return (
        <ul>
            {entriesToDisplay.map(([name, count]) => {
                if (name.startsWith('minecraft:')) {
                    name = name.substring('minecraft:'.length);
                }
                return (
                    <li key={name}>
                        <Suspense fallback={null}>
                            <MinecraftIcon name={name} />
                        </Suspense>
                        {name}: <span>{count}</span>
                    </li>
                );
            })}
        </ul>
    );
};
