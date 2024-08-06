import { useState } from 'react';
import styles from '../../style/heap.module.scss';
import WidgetsAndMetadata from '../common/components/WidgetsAndMetadata';
import useMetadataToggle from '../common/hooks/useMetadataToggle';
import { ExportCallback } from '../common/logic/export';
import { HeapMetadata } from '../proto/spark_pb';
import Controls from './controls/Controls';
import HeapTable from './HeapTable';

import 'react-virtualized/styles.css';
import HeapData from './HeapData';

export interface HeapProps {
    data: HeapData;
    metadata: HeapMetadata;
    exportCallback: ExportCallback;
}

export default function Heap({ data, metadata, exportCallback }: HeapProps) {
    const metadataToggle = useMetadataToggle();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className={styles.heap}>
            <Controls
                metadata={metadata}
                metadataToggle={metadataToggle}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                exportCallback={exportCallback}
            />
            <WidgetsAndMetadata
                metadata={metadata}
                metadataToggle={metadataToggle}
            />
            <div style={{ height: 'calc(100vh - 250px)' }}>
                <HeapTable data={data} searchQuery={searchQuery} />
            </div>
        </div>
    );
}
