import styles from '../../../style/controls.module.scss';
import ExportButton from '../../common/components/controls/ExportButton';
import { ExportCallback } from '../../common/logic/export';
import { HealthMetadata } from '../../proto/spark_pb';
import HealthTitle from '../HealthTitle';

export interface ControlsProps {
    metadata: HealthMetadata;
    exportCallback: ExportCallback;
}

export default function Controls({ metadata, exportCallback }: ControlsProps) {
    return (
        <div className={styles.controls}>
            <HealthTitle metadata={metadata} />
            <ExportButton exportCallback={exportCallback} />
        </div>
    );
}
