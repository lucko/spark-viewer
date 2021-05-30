import React, { useState, useMemo } from 'react';

import classnames from 'classnames';
import history from 'history/browser';
import Flame from './Flame';
import Metadata from './Metadata';
import SearchBar, { searchMatches } from './SearchBar';

import { humanFriendlyPercentage, formatTime } from '../misc/util';
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
    const [sourceView, setSourceView] = useState(false);

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

    function toggleSourceView() {
        setSourceView(!sourceView);
    }

    return (
        <div id="sampler">
            <div id="metadata-and-search">
                {!!metadata && <Metadata metadata={metadata} />}
                {!!Object.keys(data.classSources).length && (
                    <div
                        className="metadata-button banner-notice"
                        onClick={toggleSourceView}
                    >
                        {sourceView ? 'view: sources' : 'view: all'}
                    </div>
                )}
                {!!flameData ? (
                    <div
                        className="metadata-button banner-notice"
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

            <div style={!!flameData ? { display: 'none' } : {}}>
                {sourceView ? (
                    <SourcesView
                        classSources={data.classSources}
                        threads={threads}
                        mappings={mappings}
                        highlighted={highlighted}
                        searchQuery={searchQuery}
                    />
                ) : (
                    <AllView
                        threads={threads}
                        mappings={mappings}
                        highlighted={highlighted}
                        searchQuery={searchQuery}
                    />
                )}
            </div>

            <Menu id={'sampler-cm'} theme={theme.dark}>
                <Item onClick={handleFlame}>View as Flame Graph</Item>
                <Item onClick={handleHighlight}>Toggle bookmark</Item>
            </Menu>
        </div>
    );
}

// The sampler view in which all data is shown in one, single stack.
const AllView = ({ threads, mappings, highlighted, searchQuery }) => {
    return (
        <div className="stack">
            {threads.map(thread => (
                <BaseNode
                    parents={[]}
                    node={thread}
                    mappings={mappings}
                    highlighted={highlighted}
                    searchQuery={searchQuery}
                    key={thread.name}
                />
            ))}
        </div>
    );
};

// The sampler view in which there is a stack displayed for each known source.
const SourcesView = ({
    classSources,
    threads,
    mappings,
    highlighted,
    searchQuery,
}) => {
    // generate the sources data.
    const [data] = useState(() => {
        // get a list of each distinct source
        const sources = classSources
            ? [...new Set(Object.values(classSources))]
            : [];

        // function to scan a thread for matches
        function findMatches(acc, source, node) {
            if (node.source === source) {
                // if the source of the node matches, add it to the accumulator
                // todo: merge into acc instead?
                acc.push(node);
            } else {
                // otherwise, search the nodes children (recursively...)
                for (const child of node.children) {
                    findMatches(acc, source, child);
                }
            }
        }

        return sources
            .map(source => {
                const out = [];
                let totalTime = 0;
                for (const thread of threads) {
                    const acc = [];
                    findMatches(acc, source, thread);
                    acc.sort((a, b) => b.time - a.time);

                    if (acc.length) {
                        let copy = Object.assign({}, thread);
                        copy.children = acc;
                        out.push(copy);

                        totalTime += acc.reduce((a, c) => a + c.time, 0);
                    }
                }
                return { source, totalTime, threads: out };
            })
            .sort((a, b) => b.totalTime - a.totalTime);
    });

    return (
        <div className="sourceview">
            {data.map(({ source, totalTime, threads }) => (
                <SourceSection
                    source={source}
                    totalTime={totalTime}
                    threads={threads}
                    mappings={mappings}
                    highlighted={highlighted}
                    searchQuery={searchQuery}
                    key={source}
                />
            ))}
        </div>
    );
};

const SourceSection = ({
    source,
    totalTime,
    threads,
    mappings,
    highlighted,
    searchQuery,
}) => {
    return (
        <div className="stack">
            <h2>
                {source}{' '}
                <span className="time">({formatTime(totalTime)}ms)</span>
            </h2>
            {threads.map(thread => (
                <BaseNode
                    parents={[]}
                    node={thread}
                    searchQuery={searchQuery}
                    highlighted={highlighted}
                    mappings={mappings}
                    isSourceRoot={true}
                    key={thread.name}
                />
            ))}
        </div>
    );
};

const NodeInfo = ({
    children,
    time,
    selfTime,
    threadTime,
    source,
    isSourceRoot,
}) => {
    // if this the root of a source (a thread node), display the total of the
    // source instead of the thread as a whole
    if (isSourceRoot) {
        time = threadTime - selfTime;
    }

    return (
        <>
            {children}
            <span className="percent">
                {humanFriendlyPercentage(time / threadTime)}
            </span>
            {selfTime > 0 && !isSourceRoot ? (
                <span className="time">
                    {formatTime(time)}ms (self: {formatTime(selfTime)}ms -{' '}
                    {humanFriendlyPercentage(selfTime / threadTime)})
                </span>
            ) : (
                <span className="time">{formatTime(time)}ms</span>
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
    ({ parents, node, searchQuery, highlighted, mappings, isSourceRoot }) => {
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
                        isSourceRoot={isSourceRoot}
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
            if (
                node.className &&
                !node.className.startsWith(
                    'com.destroystokyo.paper.event.executor.asm.generated.'
                )
            ) {
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
