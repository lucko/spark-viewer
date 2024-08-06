import {
    PlatformStatistics_Memory_MemoryUsage,
    SystemStatistics_Memory_MemoryPool,
} from '../../../../proto/spark_pb';
import { formatBytes } from '../../../util/format';
import { Formatter, WidgetFormat } from '../format';
import Widget from '../Widget';
import WidgetSingleValue from '../WidgetSingleValue';

export interface MemoryWidgetProps {
    memory:
        | PlatformStatistics_Memory_MemoryUsage
        | SystemStatistics_Memory_MemoryPool;
    label: string;
}

export default function MemoryWidget({ memory, label }: MemoryWidgetProps) {
    const formatter: Formatter = {
        color: (value, total) => {
            const percent = value / total;
            if (percent > 0.9) {
                return WidgetFormat.colors.red;
            } else if (percent > 0.65) {
                return WidgetFormat.colors.yellow;
            } else {
                return WidgetFormat.colors.green;
            }
        },
        format: value => {
            return formatBytes(value);
        },
    };

    const total =
        (memory as PlatformStatistics_Memory_MemoryUsage).committed ??
        (memory as SystemStatistics_Memory_MemoryPool).total;

    return (
        <Widget title="Memory" label={label} formatter={formatter}>
            <WidgetSingleValue value={memory.used} total={total} />
        </Widget>
    );
}
