import WidgetsAndMetadata from '../common/components/WidgetsAndMetadata';
import { useAlwaysOpenMetadataToggle } from '../common/hooks/useMetadataToggle';
import useSocketClient from '../common/hooks/useSocketClient';
import useToggle from '../common/hooks/useToggle';
import { ExportCallback } from '../common/logic/export';
import { HealthMetadata } from '../proto/spark_pb';
import Controls from './components/controls/Controls';
import SocketInfo from './components/SocketInfo';
import HealthData from './HealthData';
import useSocketBindings from './hooks/useSocketBindings';

export interface HealthProps {
    data: HealthData;
    metadata: HealthMetadata;
    setMetadata: (metadata: HealthMetadata) => void;
    exportCallback: ExportCallback;
}

export default function Health({
    data,
    metadata,
    setMetadata,
    exportCallback,
}: HealthProps) {
    const metadataToggle = useAlwaysOpenMetadataToggle();
    const [showSocketInfo, setShowSocketInfo] = useToggle(
        'prefShowSocket',
        false
    );

    // WebSocket
    const socketClient = useSocketClient(data.channelInfo, () => {});
    const socket = useSocketBindings({
        socket: socketClient,
        fetchUpdatedData: () => {},
        metadata,
        setMetadata,
    });

    return (
        <div>
            <Controls
                metadata={metadata}
                exportCallback={exportCallback}
                socket={socket}
                showSocketInfo={showSocketInfo}
                setShowSocketInfo={setShowSocketInfo}
            />
            {showSocketInfo && socket.socket.socket && (
                <SocketInfo socket={socket} />
            )}
            <WidgetsAndMetadata
                metadata={metadata}
                metadataToggle={metadataToggle}
            />
        </div>
    );
}
