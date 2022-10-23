import { ReactNode } from 'react';
import { Formatter, WidgetFormat, WidgetFormatter } from './format';

export interface WidgetProps {
    title: string;
    label?: string;
    formatter?: Formatter;
    children: ReactNode;
}

export default function Widget({
    title,
    label,
    formatter = WidgetFormat.defaultFormatter,
    children,
}: WidgetProps) {
    return (
        <div className={`widget widget-${title.toLowerCase()}`}>
            <h1>
                {title}
                {label && <span>({label})</span>}
            </h1>
            <div className="widget-values">
                <WidgetFormatter.Provider value={formatter}>
                    {children}
                </WidgetFormatter.Provider>
            </div>
        </div>
    );
}
