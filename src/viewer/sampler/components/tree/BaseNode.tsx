import classnames from 'classnames';
import React, { useContext, useMemo, useState } from 'react';
import { isStackTraceNode } from '../../../proto/guards';
import { ExtendedNode } from '../../../proto/nodes';
import { BottomUpContext } from '../views/FlatView';

// context menu
import { useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import {
    HighlightedContext,
    MappingsContext,
    SearchQueryContext,
    TimeSelectorContext,
} from '../SamplerContext';
import LineNumber from './LineNumber';
import Name from './Name';
import NodeInfo from './NodeInfo';

export interface BaseNodeProps {
    parents: ExtendedNode[];
    node: ExtendedNode;
    forcedTime?: number;
    isSourceRoot?: boolean;
}

// We use React.memo to avoid re-renders. This is because the trees we work with are really deep.
const BaseNode = React.memo(
    ({ parents, node, forcedTime, isSourceRoot }: BaseNodeProps) => {
        const mappings = useContext(MappingsContext)!;
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
            if (bottomUp) {
                return (
                    directParent &&
                    directParent.parents &&
                    directParent.parents.length === 1
                );
            } else {
                return directParent && directParent.children.length === 1;
            }
        });

        const parentsForChildren = useMemo(
            () => parents.concat([node]),
            [parents, node]
        );

        const { show } = useContextMenu({ id: 'sampler-cm' });

        if (!searchQuery.matches(node, parents)) {
            return null;
        }

        const classNames = classnames({
            node: true,
            collapsed: !expanded,
            parent: parents.length === 0,
        });
        const nodeInfoClassNames = classnames({
            'node-info': true,
            'bookmarked': highlighted.has(node.id),
        });

        const nodeTime = timeSelector.getTime(node);
        const threadTime =
            parents.length === 0 ? nodeTime : timeSelector.getTime(parents[0]);

        function handleClick(e: React.MouseEvent<HTMLElement>) {
            if (e.altKey) {
                highlighted.toggle(node.id);
            } else {
                setExpanded(!expanded);
            }
        }

        function handleContextMenu(event: React.MouseEvent<HTMLElement>) {
            event.preventDefault();
            show(event, { props: { node } });
        }

        const time = bottomUp ? forcedTime || nodeTime : nodeTime;
        const selfTime = bottomUp
            ? 0
            : time -
              node.children.reduce(
                  (acc, n) => acc + timeSelector.getTime(n),
                  0
              );

        if (time === 0 && nodeTime === 0) {
            return null;
        }

        let significance;
        let importance;
        if (!directParent) {
            significance = 1;
            importance = 0;
        } else {
            const parentTime =
                directParent.sourceTime || timeSelector.getTime(directParent);
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
                        source={node.source}
                        isSourceRoot={isSourceRoot}
                    >
                        <Name node={node} mappings={mappings} />
                        {!!(
                            node.parentLineNumber &&
                            isStackTraceNode(node) &&
                            directParent &&
                            isStackTraceNode(directParent)
                        ) && <LineNumber node={node} parent={directParent} />}
                    </NodeInfo>
                </div>
                {expanded && (
                    <ul className="children">
                        {(bottomUp ? node.parents! : node.children)
                            .sort(
                                (a, b) =>
                                    timeSelector.getTime(b) -
                                    timeSelector.getTime(a)
                            )
                            .map((node, i) => (
                                <BaseNode
                                    node={node as ExtendedNode}
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
    }
);
BaseNode.displayName = 'BaseNode';

export default BaseNode;
