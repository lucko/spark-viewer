import classnames from 'classnames';
import React, { useContext, useMemo, useState } from 'react';
import { useContextMenu } from 'react-contexify';
import SourceThreadVirtualNode from '../../node/SourceThreadVirtualNode';
import VirtualNode from '../../node/VirtualNode';
import {
    HighlightedContext,
    InfoPointsContext,
    MappingsContext,
    SearchQueryContext,
    TimeSelectorContext,
} from '../SamplerContext';
import { BottomUpContext } from '../views/FlatView';
import LineNumber from './LineNumber';
import Name from './Name';
import NodeInfo from './NodeInfo';

import 'react-contexify/dist/ReactContexify.css';
import InfoPoint from './InfoPoint';

export interface BaseNodeProps {
    parents: VirtualNode[];
    node: VirtualNode;
    forcedTime?: number;
}

// We use React.memo to avoid re-renders. This is because the trees we work with are really deep.
const BaseNode = React.memo(({ parents, node, forcedTime }: BaseNodeProps) => {
    const mappings = useContext(MappingsContext)!;
    const infoPoints = useContext(InfoPointsContext)!;
    const highlighted = useContext(HighlightedContext)!;
    const searchQuery = useContext(SearchQueryContext)!;
    const timeSelector = useContext(TimeSelectorContext)!;

    const bottomUp = useContext(BottomUpContext) && parents.length !== 0;

    const directParent =
        parents.length !== 0 ? parents[parents.length - 1] : null;

    const [expanded, setExpanded] = useState(() => {
        if (highlighted.check(node)) {
            return true;
        }
        if (directParent == null) {
            return false;
        }

        const nodes = bottomUp
            ? directParent.getParents()
            : directParent.getChildren();

        const count = nodes.filter(n => searchQuery.matches(n)).length;
        return count <= 1;
    });

    const parentsForChildren = useMemo(
        () => parents.concat([node]),
        [parents, node]
    );

    const { show } = useContextMenu({ id: 'sampler-cm' });

    if (!searchQuery.matches(node)) {
        return null;
    }

    const classNames = classnames({
        node: true,
        collapsed: !expanded,
        parent: parents.length === 0,
    });
    const nodeInfoClassNames = classnames({
        'node-info': true,
        'bookmarked': highlighted.has(node),
    });

    const nodeTime = timeSelector.getTime(node);
    const threadTime =
        parents.length === 0 ? nodeTime : timeSelector.getTime(parents[0]);

    function handleClick(e: React.MouseEvent<HTMLElement>) {
        if (e.altKey) {
            highlighted.toggle(node);
        } else {
            setExpanded(!expanded);
        }
    }

    function handleContextMenu(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();
        show({ event, props: { node } });
    }

    const time = bottomUp ? forcedTime || nodeTime : nodeTime;
    const selfTime = bottomUp
        ? 0
        : time -
          node
              .getChildren()
              .reduce((acc, n) => acc + timeSelector.getTime(n), 0);

    if (time === 0 && nodeTime === 0) {
        return null;
    }

    let significance;
    let importance;
    if (!directParent) {
        significance = 1;
        importance = 0;
    } else {
        const parentSourceTime =
            directParent instanceof SourceThreadVirtualNode &&
            directParent.getSourceTime();
        const parentTime =
            parentSourceTime || timeSelector.getTime(directParent);

        significance = forcedTime
            ? 0.5
            : nodeTime < parentTime
              ? nodeTime / parentTime
              : parentTime / nodeTime;
        importance = parentTime !== nodeTime ? significance : 0;
    }

    return (
        <li className={classNames}>
            <div
                className={nodeInfoClassNames}
                onClick={handleClick}
                onContextMenu={handleContextMenu}
            >
                <NodeInfo
                    time={time}
                    selfTime={selfTime}
                    threadTime={threadTime}
                    importance={importance}
                    significance={significance}
                    source={node.getSource()}
                    infoPoint={
                        <InfoPoint
                            node={node}
                            mappings={mappings}
                            lookup={infoPoints}
                        />
                    }
                    isSourceRoot={node instanceof SourceThreadVirtualNode}
                >
                    <Name details={node.getDetails()} mappings={mappings} />
                    <LineNumber node={node} parent={directParent} />
                </NodeInfo>
            </div>
            {expanded && (
                <ul className="children">
                    {(bottomUp ? node.getParents() : node.getChildren())
                        .sort(
                            (a, b) =>
                                timeSelector.getTime(b) -
                                timeSelector.getTime(a)
                        )
                        .map((node, i) => (
                            <BaseNode
                                node={node}
                                forcedTime={
                                    bottomUp &&
                                    (forcedTime || parents.length === 2)
                                        ? time
                                        : undefined
                                }
                                parents={parentsForChildren}
                                key={i}
                            />
                        ))}
                </ul>
            )}
        </li>
    );
});
BaseNode.displayName = 'BaseNode';

export default BaseNode;
