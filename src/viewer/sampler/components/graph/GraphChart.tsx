import { useMemo } from 'react';
import {
    VictoryAxis,
    VictoryBrushContainer,
    VictoryChart,
    VictoryLabel,
    VictoryLine,
    VictoryScatter,
    VictoryTheme,
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

    function formatAxisTicks(
        value: number,
        i: number,
        wrapper: ChartDataWrapper
    ) {
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
                    onBrushDomainChangeEnd={(domain: any) => {
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
                    invertAxis={i !== 0}
                    dependentAxis
                    tickFormat={(value: any) =>
                        formatAxisTicks(value, i, wrapper)
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
