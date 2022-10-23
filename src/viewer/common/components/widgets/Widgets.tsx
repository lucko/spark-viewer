import classNames from 'classnames';
import styles from '../../../../style/widgets.module.scss';
import { HeapMetadata, SamplerMetadata } from '../../../proto/spark_pb';
import CpuWidget from './types/CpuWidget';
import DiskWidget from './types/DiskWidget';
import GcWidget from './types/GcWidget';
import MemoryWidget from './types/MemoryWidget';
import MsptWidget from './types/MsptWidget';
import PingWidget from './types/PingWidget';
import TpsWidget from './types/TpsWidget';

export interface WidgetsProps {
    metadata: SamplerMetadata | HeapMetadata;
    expanded: boolean;
}

export default function Widgets({ metadata, expanded }: WidgetsProps) {
    const platform = metadata.platformStatistics!;
    const system = metadata.systemStatistics!;

    return (
        <div
            className={classNames(styles.widgets, 'widgets')}
            data-hide={!expanded}
        >
            {platform.tps && <TpsWidget tps={platform.tps} />}
            {platform.mspt && <MsptWidget mspt={platform.mspt} />}
            <CpuWidget cpu={system.cpu!.processUsage!} label="process" />
            <MemoryWidget memory={platform.memory!.heap!} label="process" />
            <CpuWidget cpu={system.cpu!.systemUsage!} label="system" />
            <MemoryWidget memory={system.memory!.physical!} label="physical" />
            <MemoryWidget memory={system.memory!.swap!} label="swap" />
            <DiskWidget disk={system.disk!} />
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
