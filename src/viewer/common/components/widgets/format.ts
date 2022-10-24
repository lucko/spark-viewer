import React from 'react';

export type Color = `#${string}`;

export interface Formatter {
    color: (value: number, total: number) => Color;
    format: (value: number) => string | number;
}

export class WidgetFormat {
    static defaultFormatter: Formatter = {
        color: _ => '#fff',
        format: value => value,
    };

    static colors: { green: Color; yellow: Color; red: Color } = {
        green: '#30E52C',
        yellow: '#FFB802',
        red: '#F61515',
    };
}

export const WidgetFormatter = React.createContext<Formatter>(
    WidgetFormat.defaultFormatter
);
