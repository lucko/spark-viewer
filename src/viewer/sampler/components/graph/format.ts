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
        tps: '#4ade80',
        msptMedian: '#e879f9',
        cpuProcess: '#818cf8',
        cpuSystem: '#facc15',
        players: '#f43f5e',
        entities: '#fb923c',
        tileEntities: '#5eead4',
        chunks: '#d9dee3',
    }[statisticName];
}
