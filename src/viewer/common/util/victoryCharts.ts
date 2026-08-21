import { VictoryTheme } from 'victory';

export default function getTheme() {
    const theme = VictoryTheme.material;
    theme.axis!.style!.grid!.stroke = 'none';
    // @ts-ignore
    theme.axis!.style!.tickLabels!.fontFamily = 'JetBrains Mono';
    // @ts-ignore
    theme.axis!.style!.axisLabel!.fontFamily = 'JetBrains Mono';
    theme.axis!.style!.axis!.stroke = '#888';
    theme.axis!.style!.axisLabel!.fill = '#888';
    theme.axis!.style!.tickLabels!.fill = '#888';
    // @ts-ignore
    theme.legend!.style!.labels!.fontFamily = 'JetBrains Mono';
    theme.legend!.style!.labels!.fill = '#888';
    return theme;
}
