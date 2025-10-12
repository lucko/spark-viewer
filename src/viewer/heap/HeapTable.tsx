import { AutoSizer, Column, Table } from 'react-virtualized';
import { formatBytes } from '../common/util/format';
import HeapData from './HeapData';

export interface HeapTableProps {
    data: HeapData;
    searchQuery: string;
}

export default function HeapTable({ data, searchQuery }: HeapTableProps) {
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
}
