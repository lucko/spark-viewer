import { useState } from 'react';

import { AutoSizer, Column, Table } from 'react-virtualized';
import { useMetadataToggle } from '../viewer/controls';
import { WidgetsAndMetadata } from '../viewer/meta';
import Controls from './controls';

import { formatBytes } from '../misc/util';

import 'react-virtualized/styles.css';

export default function Heap({ data, exportCallback }) {
    const metadataToggle = useMetadataToggle();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="heap">
            <Controls
                data={data}
                metadataToggle={metadataToggle}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                exportCallback={exportCallback}
            />
            <WidgetsAndMetadata
                metadata={data.metadata}
                metadataToggle={metadataToggle}
            />
            <div style={{ height: 'calc(100vh - 250px)' }}>
                <HeapTable data={data} searchQuery={searchQuery} />
            </div>
        </div>
    );
}

const HeapTable = ({ data, searchQuery }) => {
    let { entries } = data;

    if (searchQuery) {
        entries = entries.filter(entry =>
            entry.type.toLowerCase().includes(searchQuery)
        );
    }

    return (
        <AutoSizer>
            {({ height, width }) => (
                <Table
                    width={width}
                    height={height}
                    className="heap-table"
                    headerHeight={40}
                    rowHeight={20}
                    rowCount={entries.length}
                    rowGetter={({ index }) => entries[index]}
                >
                    <Column
                        label="Rank"
                        dataKey="order"
                        width={70}
                        cellRenderer={({ cellData }) => {
                            return '#' + cellData;
                        }}
                    />
                    <Column
                        label="Instances"
                        dataKey="instances"
                        width={100}
                        cellRenderer={({ cellData }) => {
                            return cellData.toLocaleString();
                        }}
                    />
                    <Column
                        label="Size"
                        dataKey="size"
                        width={100}
                        cellRenderer={({ cellData }) => {
                            return formatBytes(cellData);
                        }}
                    />
                    <Column
                        label="Type"
                        dataKey="type"
                        width={200}
                        flexGrow={1}
                    />
                </Table>
            )}
        </AutoSizer>
    );
};
