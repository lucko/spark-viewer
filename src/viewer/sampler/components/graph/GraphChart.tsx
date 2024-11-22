import { useMemo } from 'react';
import {
    createContainer,
    VictoryAxis,
    VictoryChart,
    VictoryLine,
    VictoryScatter,
    VictoryTheme,
    VictoryTooltip,
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

    function formatValue(
        value: number,
        unit: string
    ) {
        if (['cpuProcess', 'cpuSystem'].includes(unit)) {
            return (value * 100).toFixed(2) + '%';
        }
        return value.toFixed(2);
    }

    const VictoryBrushVoronoiContainer: any = createContainer("brush", "voronoi");

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

                    voronoiDimension="x"
                    labelComponent={<VictoryTooltip flyoutStyle={{ fill: "#888", opacity: 0.05 }} flyoutPadding={{ top: 1, bottom: 1, left: 5, right: 5 }} />}
                    labels={({ datum }: any) => {
                        // to prevent from showing line data labels, which causes duplicated texts
                        if (datum.childName.includes("scatter")) {
                            return `${getAxisLabel(datum.unit)}: ${formatValue(datum.y, datum.unit)}`
                        }
                    }}
                />
            }
        >
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
                        },
                        labels: {
                            fill: getColor(wrapper.statisticName),
                            fontFamily: "JetBrains Mono",
                            fontSize: 10
                        }
                    }}
                />
            ))}
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

            <VictoryAxis
                domain={[0, -scale]}
                tickFormat={(x: any) => `${x}m`}
                crossAxis={false}
            />
        </VictoryChart>
    );
}

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
