import { useMemo } from 'react';
import {
    createContainer,
    VictoryAxis,
    VictoryBrushContainerProps,
    VictoryChart,
    VictoryLabel,
    VictoryLine,
    VictoryScatter,
    VictoryTheme,
    VictoryTooltip,
    VictoryVoronoiContainerProps,
} from 'victory';
import { getAxisLabel, getColor } from './format';
import { ChartDataWrapper } from './util';

export interface GraphChartProps {
    scale: number;
    data: ChartDataWrapper[];
    maxima: number[];
    selectionCallback: (range: [number, number]) => void;
}

export default function GraphChart({
    scale,
    data,
    maxima,
    selectionCallback,
}: GraphChartProps) {
    const theme = useMemo(() => getTheme(), []);
    const flyoutHeight = data.length / 7 * 80
    const flyoutWidth = data.some((data) => { return data.statisticName.includes("cpu") }) ? 150 : 100
    const flyoutOffset = { x: flyoutWidth / 2, y: flyoutHeight / 2 }

    function formatAxisTicks(
        value: number,
        i: number,
        wrapper: ChartDataWrapper
    ) {
        const scaled = value * maxima.slice(-2)[i]; // we only need the maxima of the last 2 toggled stats
        if (['cpuProcess', 'cpuSystem'].includes(wrapper.statisticName)) {
            return scaled * 100 + '%';
        }
        return scaled.toFixed();
    }

    function formatValue(
        value: number,
        unit: string
    ) {
        if (['cpuProcess', 'cpuSystem'].includes(unit)) {
            return (value * 100).toFixed(2) + '%';
        } else if (['msptMedian', 'tps'].includes(unit)) {
            return value.toFixed(2);
        }
        return value.toFixed();
    }

    return (
        <VictoryChart
            theme={theme}
            width={800}
            height={170}
            padding={{ top: 10, left: 60, right: 60, bottom: 30 }}
            domain={{ x: [-scale, 0], y: [0, 1] }}
            containerComponent={
                <VictoryBrushVoronoiContainer
                    responsive={true}
                    brushDimension="x"
                    brushStyle={{
                        stroke: 'transparent',
                        fill: 'white',
                        fillOpacity: 0.05,
                    }}
                    onBrushDomainChangeEnd={(domain: any) => {
                        selectionCallback(domain.x);
                    }}

                    mouseFollowTooltips
                    voronoiDimension="x"
                    labelComponent={<VictoryTooltip
                        flyoutStyle={{ fill: "black", opacity: 0.6 }}
                        flyoutWidth={flyoutWidth}
                        flyoutHeight={flyoutHeight}
                        flyoutPadding={0}
                        centerOffset={flyoutOffset}
                        cornerRadius={0}
                    />}
                    voronoiBlacklist={[/.*\-line$/]} // use the built-in blacklist feature to disable line labels
                    labels={({ datum }: any) => {
                        return `${getAxisLabel(datum.unit)}: ${formatValue(datum.y, datum.unit)}`
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
                        }
                    }}
                />
            ))}
            {data.map((wrapper, i) => (
                <VictoryScatter
                    key={i}
                    name={`${wrapper.statisticName}-scatter`}
                    data={wrapper.data}
                    y={datum => datum.y / maxima[i]}
                    size={({ datum, active }) => (datum.active || active ? 3 : 0)}
                    style={{
                        data: {
                            fill: getColor(wrapper.statisticName),
                            stroke: getColor(wrapper.statisticName),
                            strokeWidth: (data) => data.active ? 3 : 0,
                            strokeOpacity: 0.5,
                        },
                        labels: {
                            fill: getColor(wrapper.statisticName),
                            fontFamily: "JetBrains Mono",
                            fontSize: 10
                        }
                    }}
                />
            ))}
            {data.slice(-2).map((wrapper, i) => (
                <VictoryAxis
                    key={i}
                    orientation={i === 0 ? 'left' : 'right'}
                    invertAxis={i !== 0}
                    dependentAxis
                    tickFormat={(value: any) =>
                        formatAxisTicks(value, i, wrapper)
                    }
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
                tickFormat={(x: any) => `${x}m`}
                crossAxis={false}
            />
        </VictoryChart>
    );
}

const VictoryBrushVoronoiContainer =
    createContainer("brush", "voronoi") as React.ComponentType<VictoryBrushContainerProps & VictoryVoronoiContainerProps>;

const getTheme = () => {
    const theme = VictoryTheme.material;
    theme.axis!.style!.grid!.stroke = 'none';
    // @ts-ignore
    theme.axis!.style!.tickLabels!.fontFamily = 'JetBrains Mono';
    // @ts-ignore
    theme.axis!.style!.axisLabel!.fontFamily = 'JetBrains Mono';
    theme.axis!.style!.axis!.stroke = '#888';
    theme.axis!.style!.axisLabel!.fill = '#888';
    theme.axis!.style!.tickLabels!.fill = '#888';
    return theme;
};
