// @ts-ignore
import { FlameGraph } from '@lucko/react-flame-graph';
import { useMemo } from 'react';
import { AutoSizer } from 'react-virtualized';
import { formatBytesShort } from '../../../common/util/format';
import {
    SamplerMetadata,
    SamplerMetadata_SamplerMode,
} from '../../../proto/spark_pb';
import { TimeSelector } from '../../hooks/useTimeSelector';
import { MappingsResolver } from '../../mappings/resolver';
import VirtualNode from '../../node/VirtualNode';

export interface FlameProps {
    flameData: VirtualNode;
    mappings: MappingsResolver;
    metadata: SamplerMetadata;
    timeSelector: TimeSelector;
}

export default function Flame({
    flameData,
    mappings,
    metadata,
    timeSelector,
}: FlameProps) {
    const getTimeFunction = timeSelector.getTime;

    const isAlloc =
        metadata.samplerMode === SamplerMetadata_SamplerMode.ALLOCATION;

    const [data, depth] = useMemo(
        () => toFlameNode(flameData, mappings, getTimeFunction, isAlloc),
        [flameData, mappings, getTimeFunction, isAlloc]
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
    node: VirtualNode,
    mappings: MappingsResolver,
    getTimeFunction: TimeSelector['getTime'],
    isAlloc: boolean
): [FlameNode, number] {
    let name;
    let tooltip;

    const details = node.getDetails();

    if (details.type === 'thread') {
        name = details.name;
    } else if (details.type === 'stackTrace') {
        let resolved = mappings.resolve(details);

        if (resolved.type === 'native') {
            name = details.methodName + ' (native)';
        } else {
            let { className, methodName, packageName } = resolved;

            const nms = /^net\.minecraft\.server(?:\.v[0-9R_]+)?\.(.*)$/;
            packageName = simplifyPackageName(packageName, 'nms.', nms);

            const nm = /^net\.minecraft(?:\.v[0-9R_]+)?\.(.*)$/;
            packageName = simplifyPackageName(packageName, 'nm.', nm);

            const obc = /^org\.bukkit\.craftbukkit(?:\.v[0-9R_]+)?\.(.*)$/;
            packageName = simplifyPackageName(packageName, 'obc.', obc);

            name = `${packageName || ''}${className}.${methodName}()`;
            const formattedValue = isAlloc
                ? formatBytesShort(node.getTime())
                : `${node.getTime()}ms`;

            tooltip = `${details.className}.${details.methodName}() - ${formattedValue}`;
        }
    } else {
        throw new Error('unknown type: ' + (details as any).type);
    }

    const value = getTimeFunction(node);
    const children = [];

    let depth = 1;

    const sortedChildren = node
        .getChildren()
        .sort((a, b) => getTimeFunction(b) - getTimeFunction(a));

    for (const child of sortedChildren) {
        const [childData, childDepth] = toFlameNode(
            child,
            mappings,
            getTimeFunction,
            isAlloc
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
