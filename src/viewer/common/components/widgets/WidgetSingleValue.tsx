import useContextWithOverride from '../../hooks/useContextWithOverride';
import { Formatter, WidgetFormatter } from './format';

export interface WidgetSingleValueProps {
    value: number;
    total: number;
    formatter?: Formatter;
}

export default function WidgetSingleValue({
    value,
    total,
    formatter,
}: WidgetSingleValueProps) {
    const { color, format } = useContextWithOverride(
        WidgetFormatter,
        formatter
    );

    const percent = (value / total) * 100;
    const formattedPercent = percent
        ? percent.toLocaleString('en-US', {
              maximumFractionDigits: 2,
          }) + '%'
        : '';

    return (
        <div className="widget-value">
            <div className="widget-single-value">
                <span style={{ color: color(value, total) }}>
                    {format(value)}
                </span>
                <span>/</span>
                <span>{format(total)}</span>
            </div>
            <div>{formattedPercent}</div>
        </div>
    );
}
