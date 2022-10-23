import { PlatformStatistics_Gc } from '../../../../proto/spark_pb';
import { Formatter, WidgetFormat } from '../format';
import Widget from '../Widget';
import WidgetValue from '../WidgetValue';

export interface GcWidgetProps {
    gc: PlatformStatistics_Gc;
    title: string;
    label: string;
}

export default function GcWidget({ gc, title, label }: GcWidgetProps) {
    let warningLevels = {
        // if a GC takes > the time in ms
        time: {
            red: 150,
            yellow: 50,
        },
        // if the time between GCs is < the time in ms
        frequency: {
            red: 10000, // happening on avg every 10 seconds or more
            yellow: 20000, // happening on avg every 20 seconds or more
        },
    };

    // thresholds taken from aikar/timings
    // https://github.com/aikar/timings/blob/master/src/js/ui/ServerInfo.jsx#L20
    if (label === 'G1 Young Generation') {
        label = 'G1 Young';
        warningLevels = {
            time: {
                red: 150,
                yellow: 75,
            },
            frequency: {
                red: 2000, // 2s
                yellow: 5000, // 5s
            },
        };
    } else if (label === 'G1 Old Generation') {
        label = 'G1 Old';
        warningLevels = {
            time: {
                red: 50,
                yellow: 30,
            },
            frequency: {
                // always show an old gen as red
                red: 10000000000,
                yellow: 0,
            },
        };
    } else if (label === 'ZGC') {
        warningLevels = {
            time: {
                red: 15,
                yellow: 10,
            },
            frequency: {
                red: 500, // 0.5s
                yellow: 2000, // 2s
            },
        };
    } else if (label.startsWith('Shenandoah ')) {
        // 'Shenandoah Pauses' => 'Shen Pauses'
        // 'Shenandoah Cycles' => 'Shen Cycles'
        label = 'Shen ' + label.substring('Shenandoah '.length);
    }

    const timeFormatter: Formatter = {
        color: value => {
            if (value > warningLevels.time.red) {
                return WidgetFormat.colors.red;
            } else if (value > warningLevels.time.yellow) {
                return WidgetFormat.colors.yellow;
            } else {
                return WidgetFormat.colors.green;
            }
        },
        format: value => {
            return (
                value.toLocaleString('en-US', {
                    maximumSignificantDigits: 2,
                    useGrouping: false,
                }) + 'ms'
            );
        },
    };

    const freqFormatter: Formatter = {
        color: value => {
            if (value === 0) {
                return WidgetFormat.colors.green;
            } else if (value < warningLevels.frequency.red) {
                return WidgetFormat.colors.red;
            } else if (value < warningLevels.frequency.yellow) {
                return WidgetFormat.colors.yellow;
            } else {
                return WidgetFormat.colors.green;
            }
        },
        format: value => {
            if (value < 1000) {
                return (
                    value.toLocaleString('en-US', {
                        maximumSignificantDigits: 2,
                        useGrouping: false,
                    }) + 'ms'
                );
            }

            let minutes = 0;
            let seconds = value / 1000;
            if (seconds > 60) {
                minutes = Math.floor(seconds / 60);
                seconds -= minutes * 60;
            }

            if (minutes) {
                return minutes + 'm' + Math.round(seconds) + 's';
            } else {
                return (
                    seconds.toLocaleString('en-US', {
                        maximumFractionDigits: 1,
                    }) + 's'
                );
            }
        },
    };

    return (
        <Widget title="GC" label={label + ', ' + title}>
            <WidgetValue
                value={gc.total}
                label="total"
                formatter={WidgetFormat.defaultFormatter}
            />
            <WidgetValue
                value={gc.avgTime}
                label="avg time"
                formatter={timeFormatter}
            />
            <WidgetValue
                value={gc.avgFrequency}
                label="avg freq"
                formatter={freqFormatter}
            />
        </Widget>
    );
}
