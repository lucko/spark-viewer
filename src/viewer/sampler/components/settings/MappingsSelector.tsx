import { MappingsMetadata } from '../../mappings/fetch';

export interface MappingsSelectorProps {
    mappingsMetadata: MappingsMetadata;
    mappings: string;
    setMappings: (type: string) => void;
}

export default function MappingsSelector({
    mappingsMetadata,
    mappings,
    setMappings,
}: MappingsSelectorProps) {
    let groups: MappingsSelectorGroup[] = [
        {
            id: 'none',
            label: 'None',
            options: [
                { id: 'auto', label: 'Auto Detect' },
                { id: 'none', label: 'No Mappings' },
            ],
        },
    ];

    let type: keyof MappingsMetadata['types'];
    for (type in mappingsMetadata.types) {
        const data = mappingsMetadata.types[type];
        let versions = [];
        for (const id of Object.keys(data.versions)) {
            const version = data.versions[id];
            const label = data.format.replace('%s', version.name);
            versions.push({ id: type + '-' + id, label });
        }
        groups.push({ id: type, label: data.name, options: versions });
    }

    return (
        <span className="dropdown" id="mappings-selector">
            <select
                title="mappings"
                value={mappings}
                onChange={e => setMappings(e.target.value)}
            >
                {groups.map(group => (
                    <MappingsGroup group={group} key={group.id} />
                ))}
            </select>
        </span>
    );
}

interface MappingsSelectorGroup {
    id: string;
    label: string;
    options: MappingsSelectorGroupOptions[];
}

interface MappingsSelectorGroupOptions {
    id: string;
    label: string;
}

const MappingsGroup = ({ group }: { group: MappingsSelectorGroup }) => {
    return (
        <optgroup label={group.label}>
            {group.options.map(opt => (
                <MappingsOption option={opt} key={opt.id} />
            ))}
        </optgroup>
    );
};

const MappingsOption = ({
    option,
}: {
    option: MappingsSelectorGroupOptions;
}) => {
    return <option value={option.id}>{option.label}</option>;
};
