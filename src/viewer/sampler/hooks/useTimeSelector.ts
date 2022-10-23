import { useCallback, useMemo, useState } from 'react';
import {
    StackTraceNode,
    ThreadNode,
    WindowStatistics,
} from '../../proto/spark_pb';

export interface TimeSelector {
    supported: boolean;
    times: number[];
    isTimeSelected: (time: number) => boolean;
    setSelectedTimes: (filterFunc: TimeFilterFunction) => void;
    allTimesSelected: boolean;
    filterTimes: (times: number[]) => number[];
    getTime: (node: StackTraceNode | ThreadNode) => number;
    getTicksInRange: () => number;
}

export type TimeFilterFunction = (time: number) => boolean;

export default function useTimeSelector(
    timeWindows: number[],
    timeWindowStatistics: Record<number, WindowStatistics>
): TimeSelector {
    const supported = useMemo(() => {
        return timeWindows.length > 1;
    }, [timeWindows]);

    // holds an array of booleans indicating if the time at the given index is active
    const [selected, setSelected] = useState(() => {
        const bools = [];
        for (let i = 0; i < timeWindows.length; i++) {
            bools.push(true);
        }
        return bools;
    });

    const [allTimesSelected, setAllTimesSelected] = useState(true);

    // checks if the given time is selected
    const isTimeSelected: TimeSelector['isTimeSelected'] = useCallback(
        time => {
            return selected[timeWindows.indexOf(time)];
        },
        [selected, timeWindows]
    );

    // sets the selected times
    const setSelectedTimes: TimeSelector['setSelectedTimes'] = useCallback(
        filterFunc => {
            const times = new Set(timeWindows.filter(filterFunc));

            const bools: boolean[] = [];
            let allSelected = true;
            for (const time of timeWindows) {
                const state = times.has(time);
                bools.push(state);
                if (!state) {
                    allSelected = false;
                }
            }
            setSelected(bools);
            setAllTimesSelected(allSelected);
        },
        [timeWindows]
    );

    const filterTimes: TimeSelector['filterTimes'] = useCallback(
        times => {
            return times.filter((item, i) => selected[i]);
        },
        [selected]
    );

    const getTime: TimeSelector['getTime'] = useCallback(
        node => {
            if (node.times && !allTimesSelected) {
                return filterTimes(node.times).reduce((a, b) => a + b, 0);
            }
            return node.time;
        },
        [allTimesSelected, filterTimes]
    );

    const getTicksInRange: TimeSelector['getTicksInRange'] = useCallback(() => {
        let ticks = 0;
        for (let i = 0; i < timeWindows.length; i++) {
            if (selected[i]) {
                ticks += timeWindowStatistics[timeWindows[i]].ticks;
            }
        }
        return ticks;
    }, [selected, timeWindowStatistics, timeWindows]);

    return {
        supported,
        times: timeWindows,
        isTimeSelected,
        setSelectedTimes,
        allTimesSelected,
        filterTimes,
        getTime,
        getTicksInRange,
    };
}
