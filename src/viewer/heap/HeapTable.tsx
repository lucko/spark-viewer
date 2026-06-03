import { CSSProperties } from 'react';
import { List, RowComponentProps } from 'react-window';
import { formatBytes } from '../common/util/format';
import { HeapEntry } from '../proto/spark_pb';
import HeapData from './HeapData';

export interface HeapTableProps {
    data: HeapData;
    searchQuery: string;
}

const ROW_HEIGHT = 20;
const HEADER_HEIGHT = 40;

interface RowData {
    entries: HeapEntry[];
}

function Row({
    index,
    style,
    entries,
}: RowComponentProps<RowData> & CSSProperties) {
    const entry = (entries as HeapEntry[])[index];
    return (
        <div className="heap-table-row" style={style as CSSProperties}>
            <span className="col-rank">#{entry.order}</span>
            <span className="col-instances">
                {entry.instances.toLocaleString()}
            </span>
            <span className="col-size">{formatBytes(entry.size)}</span>
            <span className="col-type">{entry.type}</span>
        </div>
    );
}

export default function HeapTable({ data, searchQuery }: HeapTableProps) {
    let { entries } = data;

    if (searchQuery) {
        entries = entries.filter(entry =>
            entry.type.toLowerCase().includes(searchQuery)
        );
    }

    return (
        <div className="heap-table">
            <div
                className="heap-table-header"
                style={{ height: HEADER_HEIGHT }}
            >
                <span className="col-rank">Rank</span>
                <span className="col-instances">Instances</span>
                <span className="col-size">Size</span>
                <span className="col-type">Type</span>
            </div>
            <List
                rowComponent={Row}
                rowCount={entries.length}
                rowHeight={ROW_HEIGHT}
                rowProps={{ entries }}
                style={{
                    height: `calc(100% - ${HEADER_HEIGHT}px)`,
                }}
            />
        </div>
    );
}
