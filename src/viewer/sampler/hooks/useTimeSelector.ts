import { useCallback, useMemo, useState } from 'react';
import { WindowStatistics } from '../../proto/spark_pb';
import VirtualNode from '../node/VirtualNode';

export interface TimeSelector {
    supported: boolean;
    times: number[];
    isTimeSelected: (time: number) => boolean;
    setSelectedTimes: (filterFunc: TimeFilterFunction) => void;
    allTimesSelected: boolean;
    getTime: (node: VirtualNode) => number;
    getTicksInRange: () => number;
    getMillisInRange: () => number;
}

export type TimeFilterFunction = (time: number) => boolean;

export default function useTimeSelector(
    timeWindows: number[],
    timeWindowStatistics: Record<number, WindowStatistics>
): TimeSelector {
    const supported = useMemo(() => {
        return timeWindows.length > 1;
    }, [timeWindows]);

    // holds a set of selected/active times - superseded if allTimesSelected is true
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [allTimesSelected, setAllTimesSelected] = useState(true);

    // checks if the given time is selected
    const isTimeSelected: TimeSelector['isTimeSelected'] = useCallback(
        time => {
            return allTimesSelected || selected.has(time);
        },
        [selected, allTimesSelected]
    );

    // sets the selected times
    const setSelectedTimes: TimeSelector['setSelectedTimes'] = useCallback(
        filterFunc => {
            const allTimes = timeWindows;
            const times = new Set(allTimes.filter(filterFunc));

            setSelected(times);
            setAllTimesSelected(allTimes.length === times.size);
        },
        [timeWindows]
    );

    const getTime: TimeSelector['getTime'] = useCallback(
        node => {
            const times = node.getTimes();
            if (times && !allTimesSelected) {
                const filteredTimes = times.filter((_, i) =>
                    isTimeSelected(timeWindows[i])
                );
                return filteredTimes.reduce((a, b) => a + b, 0);
            }
            return node.getTime();
        },
        [allTimesSelected, isTimeSelected, timeWindows]
    );

    const getTicksInRange: TimeSelector['getTicksInRange'] = useCallback(() => {
        let ticks = 0;
        for (const windowId of timeWindows) {
            if (isTimeSelected(windowId)) {
                ticks += timeWindowStatistics[windowId].ticks;
            }
        }
        return ticks;
    }, [isTimeSelected, timeWindowStatistics, timeWindows]);

    const getMillisInRange: TimeSelector['getMillisInRange'] =
        useCallback(() => {
            let millis = 0;
            for (const windowId of timeWindows) {
                if (isTimeSelected(windowId)) {
                    millis += timeWindowStatistics[windowId].duration;
                }
            }
            return millis;
        }, [isTimeSelected, timeWindowStatistics, timeWindows]);

    return {
        supported,
        times: timeWindows,
        isTimeSelected,
        setSelectedTimes,
        allTimesSelected,
        getTime,
        getTicksInRange,
        getMillisInRange,
    };
}
