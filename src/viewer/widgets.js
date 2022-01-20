import React, { useContext } from 'react';

import classNames from 'classnames';

import { formatBytes } from '../misc/util';

const defaultFormatter = {
    color: _ => '#fff',
    format: value => value,
};

const colors = {
    green: '#30E52C',
    yellow: '#FFB802',
    red: '#F61515',
};

const WidgetFormatter = React.createContext(defaultFormatter);

export default function Widgets({ metadata, expanded }) {
    const { platformStatistics: platform, systemStatistics: system } = metadata;

    return (
        <div
            className={classNames({
                widgets: true,
                hide: !expanded,
            })}
        >
            {platform.tps && <TpsWidget tps={platform.tps} />}
            {platform.mspt && <MsptWidget mspt={platform.mspt} />}
            <CpuWidget cpu={system.cpu.processUsage} label="process" />
            <MemoryWidget memory={platform.memory.heap} label="process" />
            <CpuWidget cpu={system.cpu.systemUsage} label="system" />
            <MemoryWidget memory={system.memory.physical} label="physical" />
            <MemoryWidget memory={system.memory.swap} label="swap" />
            <DiskWidget disk={system.disk} />
            {platform.ping && <PingWidget ping={platform.ping} />}
            {Object.entries(platform.gc).map(([label, data]) => {
                return (
                    <GcWidget
                        gc={data}
                        title="during"
                        label={label}
                        key={label}
                    />
                );
            })}
            {Object.entries(system.gc).map(([label, data]) => {
                return (
                    <GcWidget
                        gc={data}
                        title="all"
                        label={label}
                        key={'system ' + label}
                    />
                );
            })}
        </div>
    );
}

const Widget = ({ title, label, formatter = defaultFormatter, children }) => {
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
};

function useContextWithOverride(context, override) {
    const res = useContext(context);
    if (override) {
        return override;
    } else {
        return res;
    }
}

const WidgetValue = ({ value, label, formatter }) => {
    const { color, format } = useContextWithOverride(
        WidgetFormatter,
        formatter
    );

    return (
        <div className="widget-value">
            <div style={{ color: color(value) }}>{format(value)}</div>
            <div>{label}</div>
        </div>
    );
};

const WidgetSingleValue = ({ value, total, formatter }) => {
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
};

const TpsWidget = ({ tps }) => {
    const formatter = {
        color: value => {
            if (value > 18) {
                return colors.green;
            } else if (value > 16) {
                return colors.yellow;
            } else {
                return colors.red;
            }
        },
        format: value => {
            return value.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        },
    };

    return (
        <Widget title="TPS" formatter={formatter}>
            <WidgetValue value={tps.last1m} label="1m" />
            <WidgetValue value={tps.last5m} label="5m" />
            <WidgetValue value={tps.last15m} label="15m" />
        </Widget>
    );
};

const MsptWidget = ({ mspt }) => {
    const formatter = {
        color: value => {
            if (value >= 50) {
                return colors.red;
            } else if (value >= 40) {
                return colors.yellow;
            } else {
                return colors.green;
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
            <WidgetValue value={mspt.last5m.min} label="min" />
            <WidgetValue value={mspt.last5m.median} label="med" />
            <WidgetValue value={mspt.last5m.percentile95} label="95%ile" />
            <WidgetValue value={mspt.last5m.max} label="max" />
        </Widget>
    );
};

const PingWidget = ({ ping }) => {
    const formatter = {
        color: value => {
            if (value >= 200) {
                return colors.red;
            } else if (value >= 100) {
                return colors.yellow;
            } else {
                return colors.green;
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
        <Widget title="Ping" formatter={formatter}>
            <WidgetValue value={ping.last15m.min} label="min" />
            <WidgetValue value={ping.last15m.median} label="med" />
            <WidgetValue value={ping.last15m.percentile95} label="95%ile" />
            <WidgetValue value={ping.last15m.max} label="max" />
        </Widget>
    );
};

const CpuWidget = ({ cpu, label }) => {
    const formatter = {
        color: value => {
            if (value > 0.9) {
                return colors.red;
            } else if (value > 0.65) {
                return colors.yellow;
            } else {
                return colors.green;
            }
        },
        format: value => {
            return (
                (value * 100).toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                }) + '%'
            );
        },
    };

    return (
        <Widget title="CPU" label={label} formatter={formatter}>
            <WidgetValue value={cpu.last1m} label="1m" />
            <WidgetValue value={cpu.last15m} label="15m" />
        </Widget>
    );
};

const MemoryWidget = ({ memory, label }) => {
    const formatter = {
        color: (value, total) => {
            const percent = value / total;
            if (percent > 0.9) {
                return colors.red;
            } else if (percent > 0.65) {
                return colors.yellow;
            } else {
                return colors.green;
            }
        },
        format: value => {
            return formatBytes(value);
        },
    };

    return (
        <Widget title="Memory" label={label} formatter={formatter}>
            <WidgetSingleValue value={memory.used} total={memory.total} />
        </Widget>
    );
};

const DiskWidget = ({ disk }) => {
    const formatter = {
        color: (value, total) => {
            const percent = value / total;
            if (percent > 0.95) {
                return colors.red;
            } else if (percent > 0.8) {
                return colors.yellow;
            } else {
                return colors.green;
            }
        },
        format: value => {
            return formatBytes(value);
        },
    };

    return (
        <Widget title="Disk" formatter={formatter}>
            <WidgetSingleValue value={disk.used} total={disk.total} />
        </Widget>
    );
};

const GcWidget = ({ gc, title, label }) => {
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
                // always show a old gen as red
                red: 10000000000,
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

    const timeFormatter = {
        color: value => {
            if (value > warningLevels.time.red) {
                return colors.red;
            } else if (value > warningLevels.time.yellow) {
                return colors.yellow;
            } else {
                return colors.green;
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

    const freqFormatter = {
        color: value => {
            if (value === 0) {
                return colors.green;
            } else if (value < warningLevels.frequency.red) {
                return colors.red;
            } else if (value < warningLevels.frequency.yellow) {
                return colors.yellow;
            } else {
                return colors.green;
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
                formatter={defaultFormatter}
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
};
