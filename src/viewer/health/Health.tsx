import styles from '../../style/heap.module.scss';
import WidgetsAndMetadata from '../common/components/WidgetsAndMetadata';
import { useAlwaysOpenMetadataToggle } from '../common/hooks/useMetadataToggle';
import { ExportCallback } from '../common/logic/export';
import { HeapMetadata } from '../proto/spark_pb';
import Controls from './controls/Controls';

import 'react-virtualized/styles.css';
import HealthData from './HealthData';

export interface HealthProps {
    data: HealthData;
    metadata: HeapMetadata;
    exportCallback: ExportCallback;
}

export default function Health({
    data,
    metadata,
    exportCallback,
}: HealthProps) {
    const metadataToggle = useAlwaysOpenMetadataToggle();
    return (
        <div className={styles.heap}>
            <Controls metadata={metadata} exportCallback={exportCallback} />
            <WidgetsAndMetadata
                metadata={metadata}
                metadataToggle={metadataToggle}
            />
        </div>
    );
}
