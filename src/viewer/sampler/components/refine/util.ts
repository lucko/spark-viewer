import { WindowStatistics } from '../../../proto/spark_pb';

type KeyNotOfType<T, V> = keyof {
    [K in keyof T as K extends V ? never : K]: any;
};

export const IGNORED_KEYS = [
    'ticks',
    'startTime',
    'endTime',
    'duration',
    'msptMax',
];

export type WindowStatisticsKey = KeyNotOfType<
    WindowStatistics,
    'ticks' | 'startTime' | 'endTime' | 'duration' | 'msptMax'
>;

export interface ChartData {
    i: number;
    unit: keyof WindowStatistics;
    x: number;
    y: number;
    active: boolean;
}

export interface ChartDataWrapper {
    statisticName: WindowStatisticsKey;
    data: ChartData[];
}
