import { PlatformStatistics_Ping } from '../../../../proto/spark_pb';
import { formatNumber } from '../../../util/format';
import { Formatter, WidgetFormat } from '../format';
import Widget from '../Widget';
import WidgetValue from '../WidgetValue';

export interface PingWidgetProps {
    ping: PlatformStatistics_Ping;
}

export default function PingWidget({ ping }: PingWidgetProps) {
    const formatter: Formatter = {
        color: value => {
            if (value >= 200) {
                return WidgetFormat.colors.red;
            } else if (value >= 100) {
                return WidgetFormat.colors.yellow;
            } else {
                return WidgetFormat.colors.green;
            }
        },
        format: value => {
            return formatNumber(value);
        },
    };

    return (
        <Widget title="Ping" formatter={formatter}>
            <WidgetValue value={ping.last15M!.min} label="min" />
            <WidgetValue value={ping.last15M!.median} label="med" />
            <WidgetValue value={ping.last15M!.percentile95} label="95%ile" />
            <WidgetValue value={ping.last15M!.max} label="max" />
        </Widget>
    );
}
