import React, { useState } from 'react';

import classNames from 'classnames';
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Widgets from './widgets';
import { formatDuration } from '../misc/util';

import {
    CommandSenderMetadata,
    PlatformMetadata as PlatformData,
} from '../proto';

export function WidgetsAndMetadata({ metadata, showMetadataDetail }) {
    return (
        <div
            className={classNames({
                metadata: true,
                expanded: showMetadataDetail.extraWidgets,
            })}
            style={{
                display: showMetadataDetail.widgets ? null : 'none',
            }}
        >
            {!!metadata.platformStatistics && (
                <Widgets
                    metadata={metadata}
                    expanded={showMetadataDetail.extraWidgets}
                />
            )}

            {!!metadata.platform && showMetadataDetail.extraWidgets && (
                <MetadataDetail metadata={metadata} />
            )}
        </div>
    );
}

export function Avatar({ user }) {
    let avatarUrl;
    if (user.type === CommandSenderMetadata.Type.PLAYER.value) {
        const uuid = user.uniqueId.replace(/-/g, '');
        avatarUrl = 'https://crafthead.net/helm/' + uuid + '/20.png';
    } else {
        avatarUrl = 'https://crafthead.net/avatar/Console/20.png';
    }

    return <img src={avatarUrl} alt="" />;
}

export function MetadataDetail({ metadata }) {
    const { platform, systemStatistics, serverConfigurations } = metadata;
    const platformType = Object.keys(PlatformData.Type)[
        platform.type
    ].toLowerCase();

    return (
        <div className="text-box metadata-detail">
            <p>
                The platform is a <span>{platform.name}</span> {platformType}{' '}
                running version &quot;
                <span>{platform.version}</span>&quot;.
            </p>
            {platform.minecraftVersion && (
                <p>
                    The detected Minecraft version is &quot;
                    <span>{platform.minecraftVersion}</span>&quot;.
                </p>
            )}
            {!!systemStatistics && (
                <>
                    <p>
                        The system is running{' '}
                        <span>{systemStatistics.os.name}</span> (
                        <span>{systemStatistics.os.arch}</span>) version &quot;
                        <span>{systemStatistics.os.version}</span>&quot; and has{' '}
                        <span>{systemStatistics.cpu.threads}</span> CPU threads
                        available.
                    </p>
                    {systemStatistics.cpu.modelName && (
                        <p>
                            The CPU is described as an{' '}
                            <span>{systemStatistics.cpu.modelName}</span>.
                        </p>
                    )}
                    <p>
                        The process is using Java{' '}
                        <span>{systemStatistics.java.version}</span> (
                        <span>{systemStatistics.java.vendorVersion}</span> from{' '}
                        <span>{systemStatistics.java.vendor}</span>).
                    </p>
                    <p>
                        The current process uptime is{' '}
                        <span>{formatDuration(systemStatistics.uptime)}</span>.
                    </p>
                    {systemStatistics.java.vmArgs && (
                        <>
                            <br />
                            <p>
                                <span>
                                    The JVM was started with the following
                                    arguments
                                </span>
                                : <br />
                                <span
                                    style={{
                                        maxWidth: '1000px',
                                        display: 'inline-block',
                                        color: 'inherit'
                                    }}
                                >
                                    {systemStatistics.java.vmArgs}
                                </span>
                            </p>
                        </>
                    )}
                </>
            )}
            {!!serverConfigurations && (
                <div className="configurations">
                    <br />
                    <p>
                        <span>
                            The server is using the following configuration
                            settings
                        </span>
                        :
                    </p>
                    <ConfigurationObject
                        data={objectMap(serverConfigurations, JSON.parse)}
                    />
                </div>
            )}
        </div>
    );
}

const ConfigurationObject = ({ data }) => {
    return (
        <ul>
            {Object.entries(data).map(([name, value], i) =>
                typeof value === 'object' ? (
                    <ObjectValue key={i} name={name} value={value} />
                ) : (
                    <ScalarValue key={i} name={name} value={value} />
                )
            )}
        </ul>
    );
};

const ObjectValue = ({ name, value }) => {
    const [open, setOpen] = useState(false);

    function click() {
        setOpen(!open);
    }

    return (
        <li>
            <span style={{ cursor: 'pointer' }} onClick={click}>
                {name}{' '}
                <FontAwesomeIcon icon={open ? faMinusSquare : faPlusSquare} />
            </span>
            {open && <ConfigurationObject data={value} />}
        </li>
    );
};

const ScalarValue = ({ name, value }) => {
    return (
        <li>
            {name}:{' '}
            <span className={'type-' + typeof value}>{String(value)}</span>
        </li>
    );
};

const objectMap = (obj, fn) => {
    return Object.fromEntries(
        Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)])
    );
};
