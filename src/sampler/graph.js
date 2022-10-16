import classNames from 'classnames';
import { useState } from 'react';
import {
    VictoryAxis,
    VictoryBrushContainer,
    VictoryChart,
    VictoryLabel,
    VictoryLine,
    VictoryScatter,
    VictoryTheme,
} from 'victory';

export default function Graph({ show, timeSelector, windowStatistics }) {
    if (!show) {
        return null;
    }

    const theme = getTheme();

    // get an array of all window times
    const times = Array.from(timeSelector.times).sort();

    // decide which statistics to show
    const sampleStatistics = windowStatistics[times[0]];
    const availableStatisticKeys = Object.keys(sampleStatistics).filter(
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

    console.log(statisticKeys);

    const maxTime = Math.max(...times);
    const data = statisticKeys.map((statisticName, i) => {
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

    // calculate maximas so we can normalise the data & display within the same domain/axis
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

            <MetricChart
                theme={theme}
                scale={scale}
                data={data}
                maxima={maxima}
                selectionCallback={range => {
                    timeSelector.setSelectedTimes(time => {
                        const x = time - maxTime;
                        return x >= range[0] && x <= range[1];
                    });
                }}
            />

            <Legend
                availableStatisticKeys={availableStatisticKeys}
                statisticKeys={statisticKeys}
                setStatisticKeys={setStatisticKeys}
            />
        </div>
    );
}

function getAxisLabel(statisticName) {
    return {
        tps: 'TPS',
        msptMedian: 'MSPT',
        cpuProcess: 'CPU (process)',
        cpuSystem: 'CPU (system)',
    }[statisticName];
}

function getColor(statisticName) {
    return {
        tps: '#71E27D',
        msptMedian: '#E271D5',
        cpuProcess: '#719DE2',
        cpuSystem: '#F7AD48',
    }[statisticName];
}

const Legend = ({
    availableStatisticKeys,
    statisticKeys,
    setStatisticKeys,
}) => {
    function click(key) {
        if (statisticKeys.includes(key)) {
            setStatisticKeys(prev => prev.filter(i => i !== key));
        } else {
            if (statisticKeys.length <= 1) {
                setStatisticKeys(prev => {
                    return [...prev, key];
                });
            } else {
                setStatisticKeys(prev => {
                    return [...prev.slice(1), key];
                });
            }
        }
    }

    return (
        <div className="legend">
            {availableStatisticKeys.map(key => {
                return (
                    <div
                        className={classNames('textbox', 'button', {
                            toggled: statisticKeys.includes(key),
                        })}
                        onClick={() => {
                            click(key);
                        }}
                        key={key}
                        style={{ color: getColor(key) }}
                    >
                        {getAxisLabel(key)}
                    </div>
                );
            })}
        </div>
    );
};

const MetricChart = ({ theme, scale, data, maxima, selectionCallback }) => {
    function formatAxisTicks(value, i, wrapper) {
        const scaled = value * maxima[i];
        if (['cpuProcess', 'cpuSystem'].includes(wrapper.statisticName)) {
            return scaled * 100 + '%';
        }
        return scaled.toFixed();
    }

    return (
        <VictoryChart
            theme={theme}
            width={800}
            height={170}
            padding={{ top: 10, left: 60, right: 60, bottom: 30 }}
            domain={{ x: [-scale, 0], y: [0, 1] }}
            containerComponent={
                <VictoryBrushContainer
                    responsive={true}
                    brushDimension="x"
                    brushStyle={{
                        stroke: 'transparent',
                        fill: 'white',
                        fillOpacity: 0.05,
                    }}
                    onBrushDomainChangeEnd={domain => {
                        selectionCallback(domain.x);
                    }}
                />
            }
        >
            {data.map((wrapper, i) => (
                <VictoryLine
                    key={i}
                    name={`${wrapper.statisticName}-line`}
                    data={wrapper.data}
                    y={datum => datum.y / maxima[i]}
                    style={{
                        data: {
                            stroke: getColor(wrapper.statisticName),
                        },
                    }}
                />
            ))}
            {data.map((wrapper, i) => (
                <VictoryScatter
                    key={i}
                    name={`${wrapper.statisticName}-scatter`}
                    data={wrapper.data}
                    y={datum => datum.y / maxima[i]}
                    size={({ datum }) => (datum.active ? 3 : 0)}
                    style={{
                        data: {
                            fill: getColor(wrapper.statisticName),
                        },
                    }}
                />
            ))}
            {data.map((wrapper, i) => (
                <VictoryAxis
                    key={i}
                    orientation={i === 0 ? 'left' : 'right'}
                    invertAxis={i === 0 ? false : true}
                    dependentAxis
                    tickFormat={value => formatAxisTicks(value, i, wrapper)}
                    label={getAxisLabel(wrapper.statisticName)}
                    axisLabelComponent={
                        <VictoryLabel dy={i === 0 ? -35 : 35} />
                    }
                    style={{
                        axisLabel: { fill: getColor(wrapper.statisticName) },
                    }}
                />
            ))}

            <VictoryAxis
                domain={[0, -scale]}
                tickFormat={x => `${x}m`}
                crossAxis={false}
            />
        </VictoryChart>
    );
};

const getTheme = () => {
    const theme = VictoryTheme.material;
    theme.axis.style.grid.stroke = 'none';
    theme.axis.style.tickLabels.fontFamily = 'JetBrains Mono';
    theme.axis.style.axisLabel.fontFamily = 'JetBrains Mono';
    theme.axis.style.axis.stroke = '#888';
    theme.axis.style.axisLabel.fill = '#888';
    theme.axis.style.tickLabels.fill = '#888';
    return theme;
};
