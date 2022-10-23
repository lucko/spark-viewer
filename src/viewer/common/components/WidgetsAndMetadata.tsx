import classNames from 'classnames';
import styles from '../../../style/metadata.module.scss';
import { HeapMetadata, SamplerMetadata } from '../../proto/spark_pb';
import { MetadataToggle } from '../hooks/useMetadataToggle';
import MetadataDetail from './metadata/MetadataDetail';
import Widgets from './widgets/Widgets';

export interface WidgetsAndMetadataProps {
    metadata: SamplerMetadata | HeapMetadata;
    metadataToggle: MetadataToggle;
}

export default function WidgetsAndMetadata({
    metadata,
    metadataToggle,
}: WidgetsAndMetadataProps) {
    return (
        <div
            className={classNames(styles.metadata, {
                expanded: metadataToggle.showInfo,
            })}
            style={{
                display: metadataToggle.showWidgets ? undefined : 'none',
            }}
        >
            {!!metadata.platformStatistics && (
                <Widgets
                    metadata={metadata}
                    expanded={metadataToggle.showInfo}
                />
            )}
            {!!metadata.platform && metadataToggle.showInfo && (
                <MetadataDetail metadata={metadata} />
            )}
        </div>
    );
}
