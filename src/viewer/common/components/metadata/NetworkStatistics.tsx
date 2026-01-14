import classNames from 'classnames';
import styles from '../../../../style/widgets.module.scss';
import {
    RollingAverageValues,
    SystemStatistics as SystemStatisticsProto,
    SystemStatistics_NetInterface,
} from '../../../proto/spark_pb';
import { formatBytes, formatNumber } from '../../util/format';
import { Formatter, WidgetFormat } from '../widgets/format';
import Widget from '../widgets/Widget';
import WidgetValue from '../widgets/WidgetValue';

export interface NetworkStatisticsProps {
    systemStatistics: SystemStatisticsProto;
}

export default function NetworkStatistics({
    systemStatistics,
}: NetworkStatisticsProps) {
    return (
        <>
            <h2>Network Interfaces</h2>
            <p>
                Note: the usage tracked below is captured at a system level
                (includes data from other processes running on the same
                machine).
            </p>
            <div>
                {Object.entries(systemStatistics.net).map(([name, data]) => (
                    <NetworkInterface key={name} name={name} data={data} />
                ))}
            </div>
        </>
    );
}

const NetworkInterface = ({
    name,
    data,
}: {
    name: string;
    data: SystemStatistics_NetInterface;
}) => {
    return (
        <div>
            <h3>{name}</h3>
            <div
                className={classNames(
                    styles.widgets,
                    'widgets',
                    'net-interface-widgets'
                )}
            >
                <NetworkInterfaceWidget
                    direction="Transmit"
                    format="bytes/sec"
                    values={data.txBytesPerSecond!}
                />
                <NetworkInterfaceWidget
                    direction="Receive"
                    format="bytes/sec"
                    values={data.rxBytesPerSecond!}
                />
            </div>
            <div
                className={classNames(
                    styles.widgets,
                    'widgets',
                    'net-interface-widgets'
                )}
            >
                <NetworkInterfaceWidget
                    direction="Transmit"
                    format="packets/sec"
                    values={data.txPacketsPerSecond!}
                />
                <NetworkInterfaceWidget
                    direction="Receive"
                    format="packets/sec"
                    values={data.rxPacketsPerSecond!}
                />
            </div>
        </div>
    );
};

type Direction = 'Transmit' | 'Receive';
type StatFormat = 'bytes/sec' | 'packets/sec';

interface NetworkInterfaceWidgetProps {
    direction: Direction;
    format: StatFormat;
    values: RollingAverageValues;
}

const NetworkInterfaceWidget = ({
    direction,
    format,
    values,
}: NetworkInterfaceWidgetProps) => {
    const formatter: Formatter = {
        color: value => {
            if (value <= 0) {
                return WidgetFormat.colors.yellow;
            }
            // TODO: set some sensible thresholds here for bytes/packets per second
            return WidgetFormat.colors.green;
        },
        format: value => {
            if (format === 'bytes/sec') {
                return formatBytes(value);
            } else {
                return formatNumber(value);
            }
        },
    };

    return (
        <Widget title={direction} label={format} formatter={formatter}>
            <WidgetValue value={values.min} label="min" />
            <WidgetValue value={values.median} label="med" />
            <WidgetValue value={values.percentile95} label="95%ile" />
            <WidgetValue value={values.max} label="max" />
        </Widget>
    );
};
