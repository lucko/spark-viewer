import classNames from 'classnames';
import styles from '../../../style/metadata.module.scss';
import { SparkMetadata } from '../../proto/guards';
import { MetadataToggle } from '../hooks/useMetadataToggle';
import MetadataDetail from './metadata/MetadataDetail';
import Widgets from './widgets/Widgets';

export interface WidgetsAndMetadataProps {
    metadata: SparkMetadata;
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
