import { Dispatch, SetStateAction } from 'react';
import styles from '../../../../style/controls.module.scss';
import ExportButton from '../../../common/components/controls/ExportButton';
import { ExportCallback } from '../../../common/logic/export';
import { HealthMetadata } from '../../../proto/spark_pb';
import HealthTitle from '../../HealthTitle';
import { SocketBinding } from '../../hooks/useSocketBindings';
import LastUpdateSpinner from './LastUpdateSpinner';

export interface ControlsProps {
    metadata: HealthMetadata;
    exportCallback: ExportCallback;
    socket: SocketBinding;
    showSocketInfo: boolean;
    setShowSocketInfo: Dispatch<SetStateAction<boolean>>;
}

export default function Controls({
    metadata,
    exportCallback,
    socket,
    showSocketInfo,
    setShowSocketInfo,
}: ControlsProps) {
    return (
        <div className={styles.controls}>
            <HealthTitle metadata={metadata} />
            <ExportButton exportCallback={exportCallback} />
            <LastUpdateSpinner
                socket={socket}
                showSocketInfo={showSocketInfo}
                setShowSocketInfo={setShowSocketInfo}
            />
        </div>
    );
}
