import React, { useMemo } from 'react';
import { AutoSizer } from 'react-virtualized';
import { FlameGraph } from '@lucko/react-flame-graph';
import { resolveMappings } from './mappings';

export default function Flame({ flameData, mappings }) {
    const [data, depth] = useMemo(
        () => toFlameNode(flameData, mappings),
        [flameData, mappings]
    );
    const calcHeight = Math.min(depth * 20, 5000);

    return (
        <div className="flame" style={{ height: `${calcHeight}px` }}>
            <AutoSizer>
                {({ width }) => (
                    <FlameGraph data={data} height={calcHeight} width={width} />
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

    let depth = 1;

    for (const child of node.children) {
        const [childData, childDepth] = toFlameNode(child, mappings);
        depth = Math.max(depth, childDepth + 1);
        obj.children.push(childData);
    }

    return [obj, depth];
}
