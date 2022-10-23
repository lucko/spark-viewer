import { useMemo } from 'react';
import { AutoSizer } from 'react-virtualized';
import { isThreadNode } from '../../../proto/guards';
import { StackTraceNode, ThreadNode } from '../../../proto/spark_pb';
import { TimeSelector } from '../../hooks/useTimeSelector';
import { MappingsResolver } from '../../logic/mappings/resolver';

// @ts-ignore
import { FlameGraph } from '@lucko/react-flame-graph';

export interface FlameProps {
    flameData: StackTraceNode | ThreadNode;
    mappings: MappingsResolver;
    timeSelector: TimeSelector;
}

export default function Flame({
    flameData,
    mappings,
    timeSelector,
}: FlameProps) {
    const getTimeFunction = timeSelector.getTime;

    const [data, depth] = useMemo(
        () => toFlameNode(flameData, mappings, getTimeFunction),
        [flameData, mappings, getTimeFunction]
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

interface FlameNode {
    name: string;
    tooltip?: string;
    value: number;
    children: FlameNode[];
}

function toFlameNode(
    node: StackTraceNode | ThreadNode,
    mappings: MappingsResolver,
    getTimeFunction: TimeSelector['getTime']
): [FlameNode, number] {
    let name;
    let tooltip;

    if (isThreadNode(node)) {
        name = node.name;
    } else {
        let resolved = mappings.resolve(node);

        if (resolved.type === 'native') {
            name = node.methodName + ' (native)';
        } else {
            let { className, methodName, packageName } = resolved;
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

            name =
                (packageName ? packageName : '') +
                className +
                '.' +
                methodName +
                '()';
            tooltip =
                node.className +
                '.' +
                node.methodName +
                '() - ' +
                node.time +
                'ms';
        }
    }

    const value = getTimeFunction(node);
    const children = [];

    let depth = 1;

    for (const child of node.children) {
        const [childData, childDepth] = toFlameNode(
            child,
            mappings,
            getTimeFunction
        );
        depth = Math.max(depth, childDepth + 1);
        children.push(childData);
    }

    return [{ name, tooltip, value, children }, depth];
}

function simplifyPackageName(
    packageName: string | undefined,
    prefix: string,
    regex: RegExp
) {
    if (!packageName) {
        return packageName;
    }

    let match = packageName.match(regex);
    if (match && match.length === 2) {
        packageName = prefix + match[1];
    }
    return packageName;
}
