import React from 'react';

export function MappingsMenu({ mappings, setMappings }) {
    let groups = [{
        id: "none",
        label: "None",
        options: [
            { id: "auto", label: "Auto Detect" },
            { id: "none", label: "No Mappings" }
        ]
    }];

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
            {group.options.map(opt => <MappingsOption option={opt} key={opt.id} />)}
        </optgroup>
    )
}

const MappingsOption = ({ option }) => {
    return <option value={option.id}>{option.label}</option>
}
