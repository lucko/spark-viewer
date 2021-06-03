import React, { Fragment } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FlameGraph } from 'react-flame-graph';
import { resolveMappings } from './mappings';

export default function Flame({ flameData, mappings }) {
    const data = buildFlameGraph(flameData, mappings);
    return (
        <div className="flame" style={{ height: 'calc(100vh - 140px)' }}>
            <AutoSizer>
                {({ height: autoSizerHeight, width }) => (
                    <Fragment>
                        <FlameGraph
                            data={data}
                            height={autoSizerHeight}
                            width={width}
                        />
                    </Fragment>
                )}
            </AutoSizer>
        </div>
    );
}

function buildFlameGraph(node, mappings) {
    let {
        thread,
        native,
        className,
        methodName,
        packageName,
    } = resolveMappings(node, mappings);

    const obj = {};
    if (thread) {
        obj.name = node.name;
    } else if (native) {
        obj.name = node.methodName + ' (native)';
    } else {
        if (packageName) {
            let match = packageName.match(
                /^net\.minecraft\.server(?:\.v[0-9R_]+)?\.(.*)$/
            );
            if (match && match.length === 2) {
                packageName = 'nms.' + match[1];
            }
            match = packageName.match(
                /^org\.bukkit\.craftbukkit(?:\.v[0-9R_]+)?\.(.*)$/
            );
            if (match && match.length === 2) {
                packageName = 'obc.' + match[1];
            }
        }
        obj.name =
            (packageName ? packageName : '') +
            className +
            '.' +
            methodName +
            '()';
        obj.tooltip =
            node.className + '.' + node.methodName + '() - ' + node.time + 'ms';
    }

    obj.value = node.time;
    obj.children = [];

    for (const child of node.children) {
        obj.children.push(buildFlameGraph(child, mappings));
    }

    return obj;
}
