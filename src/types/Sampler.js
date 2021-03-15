import React, {useState, useMemo} from 'react';
import {humanFriendlyPercentage} from '../misc/util'
import {CommandSenderData, PlatformData} from '../proto';

import classnames from 'classnames';
import history from 'history/browser';
import AutoSizedFlameGraph from '../misc/AutoSizedFlameGraph';

// context menu
import {Menu, Item, useContextMenu, theme} from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';

export function Sampler({ data, mappings }) {
    const [initialHighlights] = useState(() => {
        const set = new Set();
        const params = new URLSearchParams(window.location.search); 
        const ids = params.get('hl');
        if (ids) {
            ids.split(',').forEach(id => set.add(parseInt(id)));
        }
        return set;
    });

    const { metadata, threads } = data;
    const [ searchQuery, setSearchQuery ] = useState('');
    const [ highlighted, setHighlighted ] = useState(initialHighlights);
    const [ flameData, setFlameData ] = useState(null);

    function handleHighlight({ props }) {
        const id = props.nodeId;
        const set = new Set(highlighted);
        if (set.has(id)) {
            set.delete(id);
        } else {
            set.add(id);
        }
        setHighlighted(set);
        history.replace({
            search: '?hl=' + Array.from(set).join(',')
        });
    }

    function handleFlame({ props }) {
        const node = findNodeById(data.threads, props.nodeId);
        setFlameData(node);
    }

    function exitFlame() {
        setFlameData(null);
    }

    return <div id="sampler">
        <div id="metadata-and-search">
            {!!metadata &&
                <Metadata metadata={metadata} />
            }
            {!flameData ?
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> :
                <div className="flame-exit-button banner-notice" onClick={exitFlame}>Exit Flame View</div>
            }
        </div>

        {!!flameData &&
            <AutoSizedFlameGraph
                data={buildFlameGraph(flameData, mappings)}
                height={'calc(100vh - 140px)'}
            />
        }

        <div id="stack" style={flameData ? {display: 'none'} : {}}>
            {threads.map(thread => <BaseNode
                parents={[]}
                node={thread}
                searchQuery={searchQuery}
                highlighted={highlighted}
                mappings={mappings}
                key={thread.name}
            />)}
        </div>

        <Menu id={'sampler-cm'} theme={theme.dark}>
            <Item onClick={handleFlame}>View as Flame Graph</Item>
            <Item onClick={handleHighlight}>Toggle bookmark</Item>
        </Menu>
    </div>
}

const NodeInfo = ({ nodeId, children, time, threadTime, toggleExpand }) => {
    const { show } = useContextMenu({ id: 'sampler-cm' });

    function handleContextMenu(event) {
        event.preventDefault();
        show(event, { props: { nodeId } });
    }

    return <div onClick={toggleExpand} onContextMenu={handleContextMenu}>
        {children}
        <span className="percent">{humanFriendlyPercentage(time / threadTime)}</span>
        <span className="time">{time}ms</span>
        <span className="bar">
            <span className="bar-inner" style={{
                width: humanFriendlyPercentage(time / threadTime)
            }} />
        </span>
    </div>
}

// We use React.memo to avoid re-renders. This is because the trees we work with are really deep.
const BaseNode = React.memo(({ parents, node, searchQuery, highlighted, mappings }) => {
    const [ expanded, setExpanded ] = useState(() => {
        if (highlighted.size && isHighlighted(node, highlighted)) {
            return true;
        }
        return parents.length === 0 ? false : parents[parents.length - 1].children.length === 1
    });
    const classNames = classnames({
        'node': true,
        'collapsed': !expanded,
        'parent': parents.length === 0
    });
    const nameClassNames = classnames({
        'name': true,
        'bookmarked': highlighted.has(node.id)
    });
    const parentsForChildren = useMemo(() => parents.concat([ node ]), [parents, node]);
    const parentTime = parents.length === 0 ? node.time : parents[0].time;

    function toggleExpand() {
        setExpanded(!expanded);
    }

    if (searchQuery) {
        if (!searchMatches(searchQuery.toLowerCase(), node, parents)) {
            return null;
        }
    }

    return <li className={classNames}>
        <div className={nameClassNames}>
            <NodeInfo nodeId={node.id} time={node.time} threadTime={parentTime} toggleExpand={toggleExpand}>
                <Name node={node} mappings={mappings} />
            </NodeInfo>
        </div>
        {expanded ? (
            <ul className="children">
                {node.children.map((node, i) => <BaseNode
                    node={node}
                    parents={parentsForChildren}
                    searchQuery={searchQuery}
                    highlighted={highlighted}
                    mappings={mappings}
                    key={i}
                />)}
            </ul>
        ) : null}
    </li>
})

const Name = ({ node, mappings }) => {
    let { 
        thread, native,
        className, methodName,
        packageName, lambda,
        remappedClass, remappedMethod
    } = resolveMappings(node, mappings);

    if (thread) {
        return <>{node.name}</>
    }

    if (native) {
        return <>
            <span className="native-part">{node.methodName}</span>
            <span className="package-part"> (native)</span>
        </>;
    }

    return <>
        {packageName ? <span className="package-part">{packageName}</span> : null}
        {remappedClass ? <span className="class-part remapped" title={node.className}>{className}</span> : <span className="class-part">{className}</span>}
        {lambda ? <span className="lambda-part">{lambda}</span> : null}
        .
        {remappedMethod ? <span className="method-part remapped" title={node.methodName}>{methodName}</span> : <span className="method-part">{methodName}</span>}
        ()
    </>
}

const Metadata = ({ metadata }) => {
    let commonData = <CommonMetadata metadata={metadata} />
    let platformData = <PlatformMetadata metadata={metadata} />
    return <>
        {metadata.platform ?
            <details id="metadata" className="banner-notice"><summary>{commonData}</summary>{platformData}</details> :
            <div id="metadata" className="banner-notice">{commonData}</div>}
    </>
}

const CommonMetadata = ({ metadata }) => {
    if (metadata.user && metadata.startTime && metadata.interval) {
        const { user, startTime, interval } = metadata;

        let comment = '';
        if (metadata.comment) {
            comment = '"' + metadata.comment + '"';
        }

        const { type, name } = user;
        const start = new Date(startTime);
        const startTimeStr = start.toLocaleTimeString([], {hour12: true, hour: '2-digit', minute: '2-digit'}).replace(" ", "");
        const startDateStr = start.toLocaleDateString();

        let avatarUrl;
        if (type === CommandSenderData.Type.PLAYER.value) {
            const uuid = user.uniqueId.replace(/-/g, "");
            avatarUrl = 'https://minotar.net/avatar/' + uuid + '/20.png';
        } else {
            avatarUrl = 'https://minotar.net/avatar/Console/20.png';
        }

        document.title ='Profile' + comment + ' at ' +  startTimeStr + ' ' + startDateStr;

        return <>
            <span>
                Profile {comment} created by <img src={avatarUrl} alt="" /> {name} at {startTimeStr} on {startDateStr}, interval {interval / 1000}ms
            </span>
        </>
    }
    return null
}

const PlatformMetadata = ({ metadata }) => {
    if (metadata.platform) {
        const { platform } = metadata;
        const platformType = Object.keys(PlatformData.Type)[platform.type].toLowerCase();

        let title = platform.name + ' version "' + platform.version + '" (' + platformType + ')';
        if (platform.minecraftVersion) {
            title = title + ', Minecraft ' + platform.minecraftVersion;
        }

        return <>
            <span id="platform-data">
                {title}
            </span>
        </>
    }
    return null
}

export function MappingsMenu({ mappings, setMappings }) {
    let groups = [{ id: "none", label: "None", options: [{ id: "auto", label: "Auto Detect" }, { id: "none", label: "No Mappings" }] }];

    for (const type of Object.keys(mappings.types)) {
        const data = mappings.types[type];
        let versions = [];
        for (const id of Object.keys(data.versions)) {
            const version = data.versions[id];
            const label = data.format.replace("%s", version.name);
            versions.push({id: type + '-' + id, label});
        }
        groups.push({ id: type, label: data.name, options: versions});
    }

    return (
        <span className="dropdown" id="mappings-selector">
            <select title="mappings" onChange={e => setMappings(e.target.value)}>
                {groups.map(group => <MappingsGroup group={group} key={group.id} />)}
            </select>
        </span>
    )
}

const MappingsGroup = ({ group }) => {
    return (
        <optgroup label={group.label}>
            {group.options.map(opt => <MappingsOption option={opt} key={opt.id}>{opt.label}</MappingsOption>)}
        </optgroup>
    )
}

const MappingsOption = ({ option }) => {
    return <option value={option.id}>{option.label}</option>
}

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    function onQueryChanged(e) {
        setSearchQuery(e.target.value);
    }
    return <input className="searchbar" type="text" value={searchQuery} onChange={onQueryChanged}></input>
};

export function labelData(data) {
    let i = 0;
    for (const n of data.threads) {
        n.id = i++;
    }
    for (const n of data.threads) {
        if (n.children) {
            i = label(n.children, i);
        }
    }
}

function label(nodes, i) {
    for (const n of nodes) {
        n.id = i++;
    }
    for (const n of nodes) {
        if (n.children) {
            i = label(n.children, i);
        }
    }
    return i;
}

function resolveMappings(node, mappings) {
    if (!node.className || !node.methodName) {
        return { thread: true }
    }

    if (node.className === "native") {
        return { native: true }
    }

    let { className, methodName } = mappings.func(node) || {};

    let remappedClass = false;
    if (className) {
        remappedClass = true;
    } else {
        className = node.className;
    }

    let remappedMethod = false;
    if (methodName) {
        remappedMethod = true;
    } else {
        methodName = node.methodName;
    }

    let packageName;
    let lambda;

    const packageSplitIdx = className.lastIndexOf('.');
    if (packageSplitIdx !== -1) {
        packageName = className.substring(0, packageSplitIdx + 1);
        className = className.substring(packageSplitIdx + 1);
    }

    const lambdaSplitIdx = className.indexOf("$$Lambda");
    if (lambdaSplitIdx !== -1) {
        lambda = className.substring(lambdaSplitIdx);
        className = className.substring(0, lambdaSplitIdx);
    }

    return { className, methodName, packageName, lambda, remappedClass, remappedMethod }
}

function buildFlameGraph(node, mappings) {
    const obj = {};

    const { thread, native, className, methodName, packageName, lambda } = resolveMappings(node, mappings);

    if (thread) {
        obj.name = node.name;
    } else if (native) {
        obj.name = node.methodName + ' (native)';
    } else {
        obj.name = (packageName ? packageName : '') + className + (lambda ? lambda : '') + '.' + methodName + '()'
        obj.tooltip = node.className + '.' + node.methodName + '() - ' + node.time + 'ms';
    }

    obj.value = node.time;
    obj.children = [];

    for (const child of node.children) {
        obj.children.push(buildFlameGraph(child, mappings));
    }

    return obj;
}

function findNodeById(nodes, nodeId) {
    for (const node of nodes) {
        if (node.id === nodeId) {
            return node;
        }
        const childMatch = findNodeById(node.children, nodeId);
        if (childMatch) {
            return childMatch;
        }
    }
    return null;
}

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

function nodeMatchesQuery(query, node) {
    if (!node.className || !node.methodName) {
        return node.name.toLowerCase().includes(query);
    } else {
        return node.className.toLowerCase().includes(query) || node.methodName.toLowerCase().includes(query);
    }
}

function searchMatchesChildren(query, node) {
    if (!node.children) {
        return false;
    }
    for (const child of node.children) {
        if (nodeMatchesQuery(query, child)) {
            return true;
        }
        if (searchMatchesChildren(query, child)) {
            return true;
        }
    }
    return false;
}

function searchMatches(query, node, parents) {
    if (nodeMatchesQuery(query, node)) {
        return true;
    }
    for (const parent of parents) {
        if (nodeMatchesQuery(query, parent)) {
            return true;
        }
    }
    return searchMatchesChildren(query, node);
}
