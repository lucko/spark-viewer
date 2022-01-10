import React, { useState } from 'react';

import { AutoSizer, Column, Table } from 'react-virtualized';
import Controls from './controls';
import { WidgetsAndMetadata } from '../viewer/meta';
import { metadataDetailModes } from '../viewer/controls';

import { formatBytes } from '../misc/util';

import '../style/heap.scss';
import 'react-virtualized/styles.css';

export default function Heap({ data, exportCallback }) {
    const [showMetadataDetail, setShowMetadataDetail] = useState(
        metadataDetailModes[0]
    );

    return (
        <div className="heap">
            <Controls
                data={data}
                showMetadataDetail={showMetadataDetail}
                setShowMetadataDetail={setShowMetadataDetail}
                exportCallback={exportCallback}
            />
            <WidgetsAndMetadata
                metadata={data.metadata}
                showMetadataDetail={showMetadataDetail}
            />
            <div style={{ height: 'calc(100vh - 250px)' }}>
                <HeapTable data={data} />
            </div>
        </div>
    );
}

const HeapTable = ({ data }) => {
    const { entries } = data;

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
