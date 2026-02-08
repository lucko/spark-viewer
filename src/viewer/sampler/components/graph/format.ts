import { WindowStatisticsKey } from './util';

export function getAxisLabel(statisticName: WindowStatisticsKey) {
    return {
        tps: 'TPS',
        msptMedian: 'MSPT',
        cpuProcess: 'CPU (process)',
        cpuSystem: 'CPU (system)',
        players: 'Players',
        entities: 'Entities',
        tileEntities: 'Tile Entities',
        chunks: 'Chunks',
    }[statisticName];
}

export function getColor(statisticName: WindowStatisticsKey) {
    return {
        tps: '#71E27D',
        msptMedian: '#E271D5',
        cpuProcess: '#719DE2',
        cpuSystem: '#F7AD48',
        players: '#b72c7d',
        entities: '#fc704f',
        tileEntities: '#addcff',
        chunks: '#a1a1a1',
    }[statisticName];
}
