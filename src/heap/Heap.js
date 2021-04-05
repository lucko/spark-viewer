import React from 'react';

export default function Heap({ data }) {
    const { entries } = data;

    let rows = [];
    let totalInstances = 0;
    let totalSize = 0;

    for (const entry of entries) {
        const instances = parseInt(entry.instances);
        const size = parseInt(entry.size);

        totalInstances += instances;
        totalSize += size;

        rows.push(
            <HeapEntry
                entry={entry}
                instances={instances}
                size={size}
                key={entry.order}
            />
        );
    }

    return (
        <div id="heap">
            <div id="heap-content">
                <table style={{ borderSpacing: '20px 0' }}>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'left' }}>Rank</th>
                            <th style={{ textAlign: 'left' }}>Instances</th>
                            <th style={{ textAlign: 'left' }}>Size</th>
                            <th style={{ textAlign: 'left' }}>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Total</td>
                            <td>{totalInstances.toLocaleString()}</td>
                            <td>{formatBytes(totalSize)}</td>
                            <td>n/a</td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td />
                            <td />
                            <td />
                        </tr>
                        {rows}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const HeapEntry = ({ entry, instances, size }) => {
    return (
        <tr>
            <td>#{entry.order}</td>
            <td>{instances.toLocaleString()}</td>
            <td>{formatBytes(size)}</td>
            <td>{entry.type}</td>
        </tr>
    );
};

function formatBytes(bytes) {
    if (bytes === 0) {
        return '0 bytes';
    }
    const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const sizeIndex = Math.floor(Math.log(bytes) / Math.log(1024));
    return (
        parseFloat((bytes / Math.pow(1024, sizeIndex)).toFixed(2)) +
        ' ' +
        sizes[sizeIndex]
    );
}
