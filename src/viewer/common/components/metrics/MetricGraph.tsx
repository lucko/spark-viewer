import {
    VictoryAxis,
    VictoryChart,
    VictoryLegend,
    VictoryLine,
    VictoryTooltip,
    VictoryVoronoiContainer,
} from 'victory';
import getTheme from '../../util/victoryCharts';

export interface MetricSeries {
    name: string;
    data: { x: number; y: number }[];
    color: string;
}

export interface MetricGraphProps {
    series: MetricSeries[];
    format: (value: number) => string;
}

export default function MetricGraph({ series, format }: MetricGraphProps) {
    const flyoutHeight = 25 + 15 * series.length;
    const flyoutWidth = 200;
    const flyoutOffset = { x: flyoutWidth / 2, y: flyoutHeight / 2 };

    return (
        <>
            <div className="graph-container">
                <VictoryChart
                    theme={getTheme()}
                    scale={{ x: 'time' }}
                    minDomain={{ y: 0 }}
                    domainPadding={{ y: [0, 20] }}
                    padding={{ top: 20, right: 20, bottom: 25, left: 55 }}
                    height={300}
                    width={450}
                    animate={false}
                    containerComponent={
                        <VictoryVoronoiContainer
                            voronoiDimension="x"
                            mouseFollowTooltips
                            labels={({ datum }) =>
                                `${datum.childName}: ${format(datum.y)}`
                            }
                            labelComponent={
                                <VictoryTooltip
                                    flyoutStyle={{
                                        fill: 'black',
                                        opacity: 0.6,
                                    }}
                                    flyoutWidth={flyoutWidth}
                                    flyoutHeight={flyoutHeight}
                                    flyoutPadding={0}
                                    centerOffset={flyoutOffset}
                                    cornerRadius={3}
                                    pointerLength={0}
                                />
                            }
                        />
                    }
                >
                    <VictoryAxis
                        tickFormat={timestamp =>
                            new Date(timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            })
                        }
                        style={{
                            axis: {
                                strokeWidth: 1,
                            },
                            ticks: {
                                size: 4,
                            },
                            tickLabels: {
                                fontSize: 10,
                            },
                            grid: {
                                stroke: 'rgba(156, 163, 175, 0.15)',
                                strokeWidth: 1,
                                strokeDasharray: '0',
                            },
                        }}
                    />

                    <VictoryAxis
                        dependentAxis
                        tickFormat={value => format(value)}
                        style={{
                            axis: {
                                strokeWidth: 1,
                            },
                            ticks: {
                                size: 4,
                            },
                            tickLabels: {
                                fontSize: 10,
                            },
                            grid: {
                                stroke: 'rgba(156, 163, 175, 0.15)',
                                strokeWidth: 1,
                                strokeDasharray: '0',
                            },
                        }}
                    />

                    {series.map(s => (
                        <VictoryLine
                            key={s.name}
                            data={s.data}
                            name={s.name}
                            interpolation="monotoneX"
                            style={{
                                data: {
                                    stroke: s.color,
                                    strokeWidth: 2,
                                },
                                labels: {
                                    fill: s.color,
                                    fontFamily: 'JetBrains Mono',
                                    fontSize: 16,
                                },
                            }}
                        />
                    ))}
                </VictoryChart>
            </div>
            <div className="legend">
                <VictoryLegend
                    standalone
                    theme={getTheme()}
                    width={450}
                    height={30}
                    x={55}
                    orientation="horizontal"
                    gutter={20}
                    data={series.map(s => ({
                        name: s.name,
                        symbol: {
                            fill: s.color,
                            type: 'circle',
                        },
                    }))}
                />
            </div>
        </>
    );
}
