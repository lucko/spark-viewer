import classNames from 'classnames';
import { Dispatch, SetStateAction } from 'react';
import { getAxisLabel, getColor } from './format';
import { WindowStatisticsKey } from './util';

export interface GraphLegendProps {
    availableStatisticKeys: WindowStatisticsKey[];
    statisticKeys: WindowStatisticsKey[];
    setStatisticKeys: Dispatch<SetStateAction<WindowStatisticsKey[]>>;
}

export default function GraphLegend({
    availableStatisticKeys,
    statisticKeys,
    setStatisticKeys,
}: GraphLegendProps) {
    function click(key: WindowStatisticsKey) {
        if (statisticKeys.includes(key)) {
            setStatisticKeys(prev => prev.filter(i => i !== key));
        } else {
            if (statisticKeys.length <= 1) {
                setStatisticKeys(prev => {
                    return [...prev, key];
                });
            }
        }
    }

    return (
        <div className="legend">
            {availableStatisticKeys.map(key => {
                return (
                    <div
                        className={classNames('textbox', 'button', {
                            toggled: statisticKeys.includes(key),
                        })}
                        onClick={() => {
                            click(key);
                        }}
                        key={key}
                        style={{ color: getColor(key) }}
                    >
                        {getAxisLabel(key)}
                    </div>
                );
            })}
        </div>
    );
}
