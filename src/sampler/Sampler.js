import React, { useState, useMemo } from 'react';

import classnames from 'classnames';
import history from 'history/browser';
import Flame from './Flame';
import Metadata from './Metadata';
import SearchBar, { searchMatches } from './SearchBar';

import { humanFriendlyPercentage } from '../misc/util';
import { resolveMappings } from './mappings';

// context menu
import { Menu, Item, useContextMenu, theme } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';

export default function Sampler({ data, mappings }) {
    const { metadata, threads } = data;

    const [searchQuery, setSearchQuery] = useState('');
    const [highlighted, setHighlighted] = useState(() => {
        const set = new Set();
        const params = new URLSearchParams(window.location.search);
        const ids = params.get('hl');
        if (ids) {
            ids.split(',').forEach(id => set.add(parseInt(id)));
        }
        return set;
    });
    const [flameData, setFlameData] = useState(null);

    // Callback function for the "Toggle bookmark" context menu button
    function handleHighlight({ props }) {
        const id = props.node.id;
        const set = new Set(highlighted);
        if (set.has(id)) {
            set.delete(id);
        } else {
            set.add(id);
        }
        setHighlighted(set);
        history.replace({
            search: '?hl=' + Array.from(set).join(','),
        });
    }

    // Callback function for the "View as Flame Graph" context menu button
    function handleFlame({ props }) {
        setFlameData(props.node);
    }

    // Callback function for the "Exit Flame View" button
    function exitFlame() {
        setFlameData(null);
    }

    return (
        <div id="sampler">
            <div id="metadata-and-search">
                {!!metadata && <Metadata metadata={metadata} />}
                {!!flameData ? (
                    <div
                        className="flame-exit-button banner-notice"
                        onClick={exitFlame}
                    >
                        Exit Flame View
                    </div>
                ) : (
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />
                )}
            </div>

            {!!flameData && <Flame flameData={flameData} mappings={mappings} />}

            <div
                className="stack"
                style={!!flameData ? { display: 'none' } : {}}
            >
                {threads.map(thread => (
                    <BaseNode
                        parents={[]}
                        node={thread}
                        searchQuery={searchQuery}
                        highlighted={highlighted}
                        mappings={mappings}
                        key={thread.name}
                    />
                ))}
            </div>

            <Menu id={'sampler-cm'} theme={theme.dark}>
                <Item onClick={handleFlame}>View as Flame Graph</Item>
                <Item onClick={handleHighlight}>Toggle bookmark</Item>
            </Menu>
        </div>
    );
}

const NodeInfo = ({ children, time, selfTime, threadTime, source }) => {
    return (
        <>
            {children}
            <span className="percent">
                {humanFriendlyPercentage(time / threadTime)}
            </span>
            {selfTime > 0 ? (
                <span className="time">
                    {time}ms (self: {selfTime}ms -{' '}
                    {humanFriendlyPercentage(selfTime / threadTime)})
                </span>
            ) : (
                <span className="time">{time}ms</span>
            )}
            {!!source && <span className="time">({source})</span>}
            <span className="bar">
                <span
                    className="bar-inner"
                    style={{
                        width: humanFriendlyPercentage(time / threadTime),
                    }}
                />
            </span>
        </>
    );
};

// We use React.memo to avoid re-renders. This is because the trees we work with are really deep.
const BaseNode = React.memo(
    ({ parents, node, searchQuery, highlighted, mappings }) => {
        const [expanded, setExpanded] = useState(() => {
            if (highlighted.size && isHighlighted(node, highlighted)) {
                return true;
            }
            return parents.length === 0
                ? false
                : parents[parents.length - 1].children.length === 1;
        });
        const classNames = classnames({
            node: true,
            collapsed: !expanded,
            parent: parents.length === 0,
        });
        const nameClassNames = classnames({
            name: true,
            bookmarked: highlighted.has(node.id),
        });
        const parentsForChildren = useMemo(
            () => parents.concat([node]),
            [parents, node]
        );
        const threadTime = parents.length === 0 ? node.time : parents[0].time;

        function toggleExpand() {
            setExpanded(!expanded);
        }

        const { show } = useContextMenu({ id: 'sampler-cm' });

        function handleContextMenu(event) {
            event.preventDefault();
            show(event, { props: { node } });
        }

        if (searchQuery) {
            if (!searchMatches(searchQuery, node, parents)) {
                return null;
            }
        }

        const selfTime =
            node.time - node.children.reduce((acc, n) => acc + n.time, 0);

        return (
            <li className={classNames}>
                <div
                    className={nameClassNames}
                    onClick={toggleExpand}
                    onContextMenu={handleContextMenu}
                >
                    <NodeInfo
                        time={node.time}
                        selfTime={selfTime}
                        threadTime={threadTime}
                        source={node.source}
                    >
                        <Name node={node} mappings={mappings} />
                        {!!node.parentLineNumber && (
                            <LineNumber
                                node={node}
                                parent={parents[parents.length - 1]}
                            />
                        )}
                    </NodeInfo>
                </div>
                {expanded && (
                    <ul className="children">
                        {node.children.map((node, i) => (
                            <BaseNode
                                node={node}
                                parents={parentsForChildren}
                                searchQuery={searchQuery}
                                highlighted={highlighted}
                                mappings={mappings}
                                key={i}
                            />
                        ))}
                    </ul>
                )}
            </li>
        );
    }
);

const Name = ({ node, mappings }) => {
    let {
        thread,
        native,
        className,
        methodName,
        packageName,
        lambda,
        remappedClass,
        remappedMethod,
    } = resolveMappings(node, mappings);

    if (thread) {
        return <>{node.name}</>;
    }

    if (native) {
        return (
            <>
                <span className="native-part">{node.methodName}</span>
                <span className="package-part"> (native)</span>
            </>
        );
    }

    return (
        <>
            {!!packageName && (
                <span className="package-part">{packageName}</span>
            )}
            {remappedClass ? (
                <span className="class-part remapped" title={node.className}>
                    {className}
                </span>
            ) : (
                <span className="class-part">{className}</span>
            )}
            {!!lambda && <span className="lambda-part">{lambda}</span>}.
            {remappedMethod ? (
                <span className="method-part remapped" title={node.methodName}>
                    {methodName}
                </span>
            ) : (
                <span className="method-part">{methodName}</span>
            )}
            ()
        </>
    );
};

const LineNumber = ({ node, parent }) => {
    const title =
        'Invoked on line ' +
        node.parentLineNumber +
        ' of ' +
        parent.className +
        '.' +
        parent.methodName +
        '()';
    return (
        <span className="lineNumber" title={title}>
            :{node.parentLineNumber}
        </span>
    );
};

// Deterministically assigns a unique integer id to each node in the data.
export function labelData(nodes, i) {
    for (const n of nodes) {
        n.id = i++;
    }
    for (const n of nodes) {
        if (n.children) {
            i = labelData(n.children, i);
        }
    }
    return i;
}

// Uses the 'data.classSources' map to annotate node objects with their source
export function labelDataWithSource(data) {
    function apply(sources, nodes) {
        for (const node of nodes) {
            if (node.className) {
                const source = sources[node.className];
                if (source) {
                    node.source = source;
                }
            }
            apply(sources, node.children);
        }
    }

    if (data.classSources) {
        for (const thread of data.threads) {
            apply(data.classSources, thread.children);
        }
    }
}

// Checks if a node, or one of it's children is in the given highlighted set
function isHighlighted(node, highlighted) {
    if (highlighted.has(node.id)) {
        return true;
    }
    for (const c of node.children) {
        if (isHighlighted(c, highlighted)) {
            return true;
        }
    }
    return false;
}
