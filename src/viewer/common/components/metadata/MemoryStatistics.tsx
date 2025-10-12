import {
    PlatformStatistics_Gc,
    PlatformStatistics_Memory,
    PlatformStatistics_Memory_MemoryUsage,
} from '../../../proto/spark_pb';
import { formatBytes } from '../../util/format';
import { WidgetFormat } from '../widgets/format';

export interface MemoryStatisticsProps {
    memory: PlatformStatistics_Memory;
    gc: Record<string, PlatformStatistics_Gc>;
}

export default function MemoryStatistics({
    memory,
    gc,
}: MemoryStatisticsProps) {
    return (
        <>
            <h2>Memory Areas</h2>
            <div className="memory">
                {memory.heap && <MemoryPool name="Heap" usage={memory.heap} />}
                {memory.nonHeap && (
                    <MemoryPool name="Non Heap" usage={memory.nonHeap} />
                )}
                {(memory.pools || [])
                    .filter(pool => pool.usage)
                    .map(pool => {
                        return (
                            <MemoryPool
                                key={pool.name}
                                name={'Heap - ' + pool.name}
                                usage={pool.usage!}
                                collectionUsage={pool.collectionUsage}
                            />
                        );
                    })}
            </div>
        </>
    );
}

interface MemoryPoolProps {
    name: string;
    usage: PlatformStatistics_Memory_MemoryUsage;
    collectionUsage?: PlatformStatistics_Memory_MemoryUsage;
}

const MemoryPool = ({ name, usage, collectionUsage }: MemoryPoolProps) => {
    return (
        <div className="memory-pool">
            <div className="header">{name}</div>
            <MemoryUsageBar {...usage} />
            {collectionUsage && (
                <div>
                    <br />
                    <div className="header">{name} (at last GC)</div>
                    <MemoryUsageBar {...collectionUsage} />
                </div>
            )}
        </div>
    );
};

const MemoryUsageBar = ({
    used,
    committed,
    max,
}: PlatformStatistics_Memory_MemoryUsage) => {
    let percent;
    if (max && max > 0) {
        percent = used / max;
    } else {
        percent = used / committed;
    }

    let color;
    if (percent > 0.9) {
        color = WidgetFormat.colors.red;
    } else if (percent > 0.65) {
        color = WidgetFormat.colors.yellow;
    } else {
        color = WidgetFormat.colors.green;
    }

    return (
        <>
            <div className="usage-bar">
                <div
                    style={{
                        width: `${Math.ceil(percent * 100)}%`,
                        backgroundColor: color,
                    }}
                />
            </div>
            <ul>
                <li>
                    Used: <span>{formatBytes(used)}</span>
                </li>
                <li>
                    Committed: <span>{formatBytes(committed)}</span>
                </li>
                {max !== -1 && max !== committed && (
                    <li>
                        Max: <span>{formatBytes(max)}</span>
                    </li>
                )}
            </ul>
        </>
    );
};
