import React, { Suspense } from 'react';

const MinecraftIcon = React.lazy(
    () => import('../../../../../components/MinecraftIcon')
);

export interface EntityCountsListProps {
    entityCounts: Record<string, number>;
}

export default function EntityCountsList({
    entityCounts,
}: EntityCountsListProps) {
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
}
