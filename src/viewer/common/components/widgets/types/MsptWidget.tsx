import { PlatformStatistics_Mspt } from '../../../../proto/spark_pb';
import { Formatter, WidgetFormat } from '../format';
import Widget from '../Widget';
import WidgetValue from '../WidgetValue';

export interface MsptWidgetProps {
    mspt: PlatformStatistics_Mspt;
}

export default function MsptWidget({ mspt }: MsptWidgetProps) {
    const formatter: Formatter = {
        color: value => {
            if (value >= 50) {
                return WidgetFormat.colors.red;
            } else if (value >= 40) {
                return WidgetFormat.colors.yellow;
            } else {
                return WidgetFormat.colors.green;
            }
        },
        format: value => {
            return value.toLocaleString('en-US', {
                maximumSignificantDigits: 3,
                useGrouping: false,
            });
        },
    };

    return (
        <Widget title="MSPT" formatter={formatter}>
            <WidgetValue value={mspt.last5M!.min} label="min" />
            <WidgetValue value={mspt.last5M!.median} label="med" />
            <WidgetValue value={mspt.last5M!.percentile95} label="95%ile" />
            <WidgetValue value={mspt.last5M!.max} label="max" />
        </Widget>
    );
}
