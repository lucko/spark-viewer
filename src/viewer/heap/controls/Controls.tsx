import { Dispatch, SetStateAction } from 'react';
import styles from '../../../style/controls.module.scss';
import ExportButton from '../../common/components/controls/ExportButton';
import ShowInfoButton from '../../common/components/controls/ShowInfoButton';
import { MetadataToggle } from '../../common/hooks/useMetadataToggle';
import { ExportCallback } from '../../common/logic/export';
import { HeapMetadata } from '../../proto/spark_pb';
import HeapTitle from '../HeapTitle';
import SearchBar from './SearchBar';

export interface ControlsProps {
    metadata: HeapMetadata;
    metadataToggle: MetadataToggle;
    searchQuery: string;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    exportCallback: ExportCallback;
}

export default function Controls({
    metadata,
    metadataToggle,
    searchQuery,
    setSearchQuery,
    exportCallback,
}: ControlsProps) {
    return (
        <div className={styles.controls}>
            <HeapTitle metadata={metadata} />
            <ShowInfoButton
                metadata={metadata}
                metadataToggle={metadataToggle}
            />
            <ExportButton exportCallback={exportCallback} />
            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
        </div>
    );
}
