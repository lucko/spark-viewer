import React from 'react';
import { Metrics } from '../../../proto/spark_pb';

export const Metric = ({
    title,
    label,
    children,
}: {
    title: string;
    label?: string;
    children: React.ReactNode;
}) => {
    return (
        <div className="metric">
            <h1>
                {title}
                {label && <span>({label})</span>}
            </h1>
            <div className="graph">{children}</div>
        </div>
    );
};

export interface MetricProps {
    metrics: Metrics;
    timeRange: number;
}

export type GenericSeries<T> = {
    startTimestampMs: number;
    timestampDeltasMs: number[];
    values: T[];
};

export type SeriesData = { x: number; y: number }[];

export function convertSeries<T>(
    series: GenericSeries<T> | undefined,
    map: (value: T) => number,
    timeRangeMins: number
): SeriesData | undefined {
    if (!series) {
        return undefined;
    }

    let prevTimestamp = series.startTimestampMs;
    const data: SeriesData = [];

    for (let i = 0; i < series.timestampDeltasMs.length; i++) {
        const time = prevTimestamp + series.timestampDeltasMs[i];
        const value = series.values[i];

        data.push({ x: time, y: map(value) });
        prevTimestamp = time;
    }

    if (data.length) {
        const lastTime = data[data.length - 1].x;
        const cutoffTime = lastTime - timeRangeMins * 60 * 1000;
        while (data.length && data[0].x < cutoffTime) {
            data.shift();
        }
    }

    return data;
}
