import { useState } from 'react';
import styles from '../../../style/heap.module.scss';
import WidgetsAndMetadata from '../../common/components/WidgetsAndMetadata';
import useMetadataToggle from '../../common/hooks/useMetadataToggle';
import { ExportCallback } from '../../common/logic/export';
import { HeapData } from '../../proto/spark_pb';
import Controls from './controls/Controls';
import HeapTable from './HeapTable';

import 'react-virtualized/styles.css';

export interface HeapProps {
    data: HeapData;
    exportCallback: ExportCallback;
}

export default function Heap({ data, exportCallback }: HeapProps) {
    const metadataToggle = useMetadataToggle();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className={styles.heap}>
            <Controls
                data={data}
                metadataToggle={metadataToggle}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                exportCallback={exportCallback}
            />
            <WidgetsAndMetadata
                metadata={data.metadata!}
                metadataToggle={metadataToggle}
            />
            <div style={{ height: 'calc(100vh - 250px)' }}>
                <HeapTable data={data} searchQuery={searchQuery} />
            </div>
        </div>
    );
}
