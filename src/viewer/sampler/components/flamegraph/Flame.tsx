// @ts-ignore
import { FlameGraph } from '@lucko/react-flame-graph';
import { useMemo, useRef, useState } from 'react';
import { AutoSizer } from 'react-virtualized';
import { formatBytesShort } from '../../../common/util/format';
import {
    SamplerMetadata,
    SamplerMetadata_SamplerMode,
} from '../../../proto/spark_pb';
import { TimeSelector } from '../../hooks/useTimeSelector';
import { MappingsResolver } from '../../mappings/resolver';
import VirtualNode from '../../node/VirtualNode';
import { Menu, Item, ItemParams } from 'react-contexify';
import { useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';

export interface FlameProps {
    flameData: VirtualNode;
    mappings: MappingsResolver;
    metadata: SamplerMetadata;
    timeSelector: TimeSelector;
    onReturnToSampler?: (node: VirtualNode) => void;
}

export default function Flame({
    flameData,
    mappings,
    metadata,
    timeSelector,
    onReturnToSampler,
}: FlameProps) {
    const getTimeFunction = timeSelector.getTime;
    const flameRef = useRef<HTMLDivElement>(null);
    const { show } = useContextMenu({ id: 'flame-cm' });

    const isAlloc =
        metadata.samplerMode === SamplerMetadata_SamplerMode.ALLOCATION;

    const [data, depth] = useMemo(
        () => toFlameNode(flameData, mappings, getTimeFunction, isAlloc),
        [flameData, mappings, getTimeFunction, isAlloc]
    );
    const calcHeight = Math.min(depth * 20, 5000);

    const [selectedNode, setSelectedNode] = useState<VirtualNode | null>(null);

    // Handler for context menu on the main div
    function handleDivContextMenu(event: React.MouseEvent) {
        event.preventDefault();
        if (selectedNode) {
            show({ event, props: { node: selectedNode } });
        }
    }

    // Handler for mouse over on FlameGraph
    function handleMouseOver(flameNode: any) {
        if (flameNode && flameNode.virtualNode) {
            setSelectedNode(flameNode.virtualNode);
        } else {
            setSelectedNode(null);
        }
    }

    return (
        <div
            className="flame"
            style={{ height: `${calcHeight}px` }}
            ref={flameRef}
            onContextMenu={handleDivContextMenu}
        >
            <AutoSizer>
                {({ width }: { width: number }) => (
                    <FlameGraph
                        data={data}
                        height={calcHeight}
                        width={width}
                        onMouseOver={(_e: any, node: any) => handleMouseOver(node)}
                    />
                )}
            </AutoSizer>
            <Menu id="flame-cm" theme="dark">
                <Item onClick={({ props }: ItemParams<{ node: VirtualNode }>) => props?.node && onReturnToSampler && onReturnToSampler(props.node)}>
                    View in sampler
                </Item>
            </Menu>
        </div>
    );
}

interface FlameNode {
    name: string;
    tooltip?: string;
    value: number;
    children: FlameNode[];
    virtualNode: VirtualNode;
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

    return [{ name, tooltip, value, children, virtualNode: node }, depth];
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
