import React from 'react';

export type Color = `#${string}` | `var(--${string})`;

export interface Formatter {
    color: (value: number, total: number) => Color;
    format: (value: number) => string | number;
}

export class WidgetFormat {
    static defaultFormatter: Formatter = {
        color: _ => 'var(--text-white)',
        format: value => value,
    };

    static colors: { green: Color; yellow: Color; red: Color } = {
        green: 'var(--accent-green)',
        yellow: 'var(--accent-yellow)',
        red: 'var(--accent-red)',
    };
}

export const WidgetFormatter = React.createContext<Formatter>(
    WidgetFormat.defaultFormatter
);
