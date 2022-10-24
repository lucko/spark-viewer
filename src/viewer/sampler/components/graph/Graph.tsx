import { useState } from 'react';
import { WindowStatistics } from '../../../proto/spark_pb';
import { TimeSelector } from '../../hooks/useTimeSelector';
import GraphChart from './GraphChart';
import GraphLegend from './GraphLegend';
import { ChartDataWrapper, WindowStatisticsKey } from './util';

export interface GraphProps {
    show: boolean;
    timeSelector: TimeSelector;
    windowStatistics: Record<number, WindowStatistics>;
}

export default function Graph({
    show,
    timeSelector,
    windowStatistics,
}: GraphProps) {
    if (!show) {
        return null;
    }

    // get an array of all window times
    const times = Array.from(timeSelector.times).sort();

    // decide which statistics to show
    const sampleStatistics = windowStatistics[times[0]];
    const availableStatisticKeys = (
        Object.keys(sampleStatistics) as WindowStatisticsKey[]
    ).filter(
        key =>
            !!sampleStatistics[key] && // only show statistics we have values for
            key !== 'ticks' &&
            key !== 'msptMax' // don't show msptMax, we show msptMedian instead
    );

    const [statisticKeys, setStatisticKeys] = useState(() => {
        let keys = availableStatisticKeys;
        if (keys.includes('msptMedian')) {
            keys = keys.filter(el => ['msptMedian', 'tps'].includes(el));
        } else if (keys.includes('tps')) {
            keys = keys.filter(el => ['cpuProcess', 'tps'].includes(el));
        }
        return keys;
    });

    const maxTime = Math.max(...times);
    const data: ChartDataWrapper[] = statisticKeys.map((statisticName, i) => {
        return {
            statisticName,
            data: times.map(time => ({
                i,
                unit: statisticName,
                x: time - maxTime,
                y: windowStatistics[time][statisticName],
                active: timeSelector.isTimeSelected(time),
            })),
        };
    });

    // calculate maximas so that we can normalise the data & display within the same domain/axis
    const maxima = data.map(wrapper => {
        if (['cpuProcess', 'cpuSystem'].includes(wrapper.statisticName)) {
            return 1; // 100%
        }

        const max = Math.max(...wrapper.data.map(d => d.y));
        if (wrapper.statisticName === 'tps') {
            return Math.max(max, 20);
        }
        if (wrapper.statisticName === 'msptMedian') {
            return Math.ceil(max / 5) * 5; // round up to nearest 5
        }
        throw new Error('unknown statistic: ' + wrapper.statisticName);
    });

    const scale = times.length - 1;

    return (
        <div className="graph">
            <div className="header">
                <h2>Refine</h2>
                <p>
                    The graph below shows some key metrics over the course of
                    the profile. You can drag + select with your cursor to
                    refine the profile to a specific time period.
                </p>
            </div>

            <GraphChart
                scale={scale}
                data={data}
                maxima={maxima}
                selectionCallback={(range: [number, number]) => {
                    timeSelector.setSelectedTimes(time => {
                        const x = time - maxTime;
                        return x >= range[0] && x <= range[1];
                    });
                }}
            />

            <GraphLegend
                availableStatisticKeys={availableStatisticKeys}
                statisticKeys={statisticKeys}
                setStatisticKeys={setStatisticKeys}
            />
        </div>
    );
}
