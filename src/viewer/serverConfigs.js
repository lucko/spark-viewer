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
    const oldPaperConfig = parsedConfigurations['paper.yml'];
    const newPaperConfig = parsedConfigurations['paper/']?.['global.yml'];

    if (serverProperties?.['online-mode'] === true) {
        return 'online mode';
    }

    if (spigotConfig?.settings?.bungeecord === true) {
        if (
            oldPaperConfig?.['settings']?.['bungee-online-mode'] === false ||
            newPaperConfig?.['proxies']?.['bungee-cord']?.['online-mode'] === false
        ) {
            return 'offline mode (BungeeCord)';
        }

        return 'online mode (BungeeCord)';
    }

    if (
        oldPaperConfig?.['settings']?.['velocity-support']?.enabled === true ||
        newPaperConfig?.['proxies']?.['velocity']?.enabled === true
    ) {
        if (
            (oldPaperConfig?.['settings']?.['velocity-support']?.['online-mode'] === false) ||
            (newPaperConfig?.['proxies']?.['velocity']?.['online-mode'] === false)
        ) {
            return 'offline mode (Velocity)';
        }

        return 'online mode (Velocity)';
    }

    return 'offline mode';
}
