import { ReactNode, useContext } from 'react';
import {
    formatTime,
    humanFriendlyPercentage,
} from '../../../common/util/format';
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

    let timePerTick: number;
    if (labelMode) {
        let numberOfTicks = timeSelector.supported
            ? timeSelector.getTicksInRange()
            : metadata.dataAggregator?.numberOfIncludedTicks ||
              metadata.numberOfTicks;
        timePerTick = time / numberOfTicks;
    }

    return (
        <>
            <span className="name">
                {children}
                <span className="percent" style={{ filter, opacity }}>
                    {labelMode
                        ? `${formatTime(timePerTick!)}ms`
                        : humanFriendlyPercentage(time / threadTime)}
                </span>
                <span className="time">
                    {formatTime(time)}ms
                    {Math.floor(selfTime) > 0 && !isSourceRoot && (
                        <>
                            {' '}
                            (self: {formatTime(selfTime)}ms -{' '}
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
