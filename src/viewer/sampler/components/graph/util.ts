import { WindowStatistics } from '../../../proto/spark_pb';

export type WindowStatisticsKey = keyof WindowStatistics;

export interface ChartData {
    i: number;
    unit: keyof WindowStatistics;
    x: number;
    y: number;
    active: boolean;
}

export interface ChartDataWrapper {
    statisticName: keyof WindowStatistics;
    data: ChartData[];
}
