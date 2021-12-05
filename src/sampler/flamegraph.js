import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FlameGraph } from '@lucko/react-flame-graph';
import { resolveMappings } from './mappings';

export default function Flame({ flameData, mappings }) {
    const data = toFlameNode(flameData, mappings);
    return (
        <div className="flame" style={{ height: 'calc(100vh - 140px)' }}>
            <AutoSizer>
                {({ height: autoSizerHeight, width }) => (
                    <FlameGraph
                        data={data}
                        height={autoSizerHeight}
                        width={width}
                    />
                )}
            </AutoSizer>
        </div>
    );
}

function simplifyPackageName(packageName, prefix, regex) {
    if (!packageName) {
        return packageName;
    }

    let match = packageName.match(regex);
    if (match && match.length === 2) {
        packageName = prefix + match[1];
    }
    return packageName;
}

function toFlameNode(node, mappings) {
    let { thread, native, className, methodName, packageName } =
        resolveMappings(node, mappings);

    const obj = {};
    if (thread) {
        obj.name = node.name;
    } else if (native) {
        obj.name = node.methodName + ' (native)';
    } else {
        packageName = simplifyPackageName(
            packageName,
            'nms.',
            /^net\.minecraft\.server(?:\.v[0-9R_]+)?\.(.*)$/
        );
        packageName = simplifyPackageName(
            packageName,
            'nm.',
            /^net\.minecraft(?:\.v[0-9R_]+)?\.(.*)$/
        );
        packageName = simplifyPackageName(
            packageName,
            'obc.',
            /^org\.bukkit\.craftbukkit(?:\.v[0-9R_]+)?\.(.*)$/
        );

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
        obj.children.push(toFlameNode(child, mappings));
    }

    return obj;
}
