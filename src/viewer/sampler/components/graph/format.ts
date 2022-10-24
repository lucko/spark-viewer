import { WindowStatisticsKey } from './util';

export function getAxisLabel(statisticName: WindowStatisticsKey) {
    if (statisticName === 'ticks' || statisticName === 'msptMax') {
        throw new Error('cannot get label for ' + statisticName);
    }

    return {
        tps: 'TPS',
        msptMedian: 'MSPT',
        cpuProcess: 'CPU (process)',
        cpuSystem: 'CPU (system)',
    }[statisticName];
}

export function getColor(statisticName: WindowStatisticsKey) {
    if (statisticName === 'ticks' || statisticName === 'msptMax') {
        throw new Error('cannot get color for ' + statisticName);
    }

    return {
        tps: '#71E27D',
        msptMedian: '#E271D5',
        cpuProcess: '#719DE2',
        cpuSystem: '#F7AD48',
    }[statisticName];
}
