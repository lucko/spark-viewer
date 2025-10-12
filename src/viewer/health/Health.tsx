import WidgetsAndMetadata from '../common/components/WidgetsAndMetadata';
import { useAlwaysOpenMetadataToggle } from '../common/hooks/useMetadataToggle';
import { ExportCallback } from '../common/logic/export';
import { HealthMetadata } from '../proto/spark_pb';
import Controls from './controls/Controls';

import 'react-virtualized/styles.css';
import HealthData from './HealthData';

export interface HealthProps {
    data: HealthData;
    metadata: HealthMetadata;
    exportCallback: ExportCallback;
}

export default function Health({ metadata, exportCallback }: HealthProps) {
    const metadataToggle = useAlwaysOpenMetadataToggle();
    return (
        <div>
            <Controls metadata={metadata} exportCallback={exportCallback} />
            <WidgetsAndMetadata
                metadata={metadata}
                metadataToggle={metadataToggle}
            />
        </div>
    );
}
