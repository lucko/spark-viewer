import { ReactNode, useContext } from 'react';
import {
    formatBytesShort,
    formatTime,
    humanFriendlyPercentage,
} from '../../../common/util/format';
import { SamplerMetadata_SamplerMode } from '../../../proto/spark_pb';
import {
    LabelModeContext,
    MetadataContext,
    TimeSelectorContext,
} from '../SamplerContext';

export interface NodeInfoProps {
    children: ReactNode;
    time: number;
    selfTime: number;
    threadTime: number;
    importance: number;
    significance: number;
    source?: string;
    isSourceRoot?: boolean;
}

export default function NodeInfo({
    children,
    time,
    selfTime,
    threadTime,
    importance,
    significance,
    source,
    isSourceRoot,
}: NodeInfoProps) {
    const metadata = useContext(MetadataContext)!;

    // if this the root of a source (a thread node), display the total of the
    // source instead of the thread as a whole
    if (isSourceRoot) {
        time = threadTime - selfTime;
    }

    const filter =
        `hue-rotate(-${25 * importance}deg)` +
        ' ' +
        `saturate(${1 + 13 * importance})`;

    const opacity =
        significance < 0.01 ? 0.5 + (significance * 100) / 2 : undefined;

    const labelMode = useContext(LabelModeContext)!;
    const timeSelector = useContext(TimeSelectorContext)!;

    let timePerInterval: number;
    if (labelMode) {
        // labelMode is on
        // execution  ==> time per tick
        // allocation ==> bytes per second
        if (metadata.samplerMode === SamplerMetadata_SamplerMode.ALLOCATION) {
            const numberOfMilliseconds = timeSelector.supported
                ? timeSelector.getMillisInRange()
                : metadata.endTime - metadata.startTime;
            const numberOfSeconds = numberOfMilliseconds / 1000;
            timePerInterval = time / numberOfSeconds;
        } else {
            const numberOfTicks = timeSelector.supported
                ? timeSelector.getTicksInRange()
                : metadata.dataAggregator?.numberOfIncludedTicks ||
                  metadata.numberOfTicks;
            timePerInterval = time / numberOfTicks;
        }
    }

    function formatValue(value: number) {
        if (metadata.samplerMode === SamplerMetadata_SamplerMode.ALLOCATION) {
            return formatBytesShort(value);
        } else {
            return formatTime(value) + 'ms';
        }
    }

    return (
        <>
            <span className="name">
                {children}
                <span className="percent" style={{ filter, opacity }}>
                    {labelMode
                        ? `${formatValue(timePerInterval!)}`
                        : humanFriendlyPercentage(time / threadTime)}
                </span>
                <span className="time">
                    {formatValue(time)}
                    {Math.floor(selfTime) > 0 && !isSourceRoot && (
                        <>
                            {' '}
                            (self: {formatValue(selfTime)} -{' '}
                            {humanFriendlyPercentage(selfTime / threadTime)})
                        </>
                    )}
                    {!!source && <> ({source})</>}
                </span>
            </span>
            <div className="bar">
                <span
                    className="inner"
                    style={{
                        width: humanFriendlyPercentage(time / threadTime),
                    }}
                />
            </div>
        </>
    );
}
