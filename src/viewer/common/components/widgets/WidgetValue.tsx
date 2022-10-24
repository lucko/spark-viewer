import useContextWithOverride from '../../hooks/useContextWithOverride';
import { Formatter, WidgetFormatter } from './format';

export interface WidgetValueProps {
    value: number;
    label: string;
    formatter?: Formatter;
}

export default function WidgetValue({
    value,
    label,
    formatter,
}: WidgetValueProps) {
    const { color, format } = useContextWithOverride(
        WidgetFormatter,
        formatter
    );

    return (
        <div className="widget-value">
            <div style={{ color: color(value, 1) }}>{format(value)}</div>
            <div>{label}</div>
        </div>
    );
}
