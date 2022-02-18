import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';

export function ServerConfigurations({ parsedConfigurations }) {
    return (
        <div className="configurations">
            <p>The server is using the following configuration settings:</p>
            <ConfigurationObject data={parsedConfigurations} />
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

export function detectOnlineMode(parsedConfigurations) {
    const serverProperties = parsedConfigurations['server.properties'];
    const spigotConfig = parsedConfigurations['spigot.yml'];
    const paperConfig = parsedConfigurations['paper.yml'];

    if (serverProperties['online-mode'] === true) {
        return 'online mode';
    }

    if (spigotConfig && spigotConfig.settings.bungeecord === true) {
        if (
            paperConfig &&
            paperConfig.settings['bungee-online-mode'] === false
        ) {
            return 'BungeeCord (offline mode)';
        }

        return 'BungeeCord (online mode)';
    }

    if (
        paperConfig &&
        paperConfig.settings['velocity-support'] &&
        paperConfig.settings['velocity-support']['enabled'] === true
    ) {
        if (paperConfig.settings['velocity-support']['online-mode'] === false) {
            return 'Velocity (offline mode)';
        }

        return 'Velocity (online mode)';
    }

    return 'offline mode';
}
