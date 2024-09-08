import {
    PluginOrModMetadata,
    WorldStatistics_DataPack,
} from '../../../proto/spark_pb';

export interface PluginsModsListProps {
    plugins: PluginOrModMetadata[];
    datapacks: WorldStatistics_DataPack[];
}

export default function PluginsModsList({
    plugins,
    datapacks,
}: PluginsModsListProps) {
    return (
        <div className="plugins-mods-list">
            {plugins.length && (
                <>
                    <h2>Plugins/Mods</h2>
                    <ul>
                        {plugins.map(plugin => (
                            <li key={plugin.name}>
                                <PluginMod {...plugin} />
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {datapacks.length && (
                <>
                    <h2>Data Packs</h2>
                    <ul>
                        {datapacks.map(datapack => (
                            <li key={datapack.name}>
                                <Datapack {...datapack} />
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

const Datapack = ({ name, description, source }: WorldStatistics_DataPack) => {
    const nameComponent = <span className="title">{name}</span>;

    const sourceComponent = source ? (
        <>
            {' '}
            <span className="darker">(</span>
            {source}
            <span className="darker">)</span>
        </>
    ) : null;

    const descriptionComponent = description ? (
        <>
            <br />
            {description}
        </>
    ) : null;

    return (
        <>
            {nameComponent}
            {sourceComponent}
            {descriptionComponent}
        </>
    );
};

const PluginMod = ({
    name,
    version,
    author,
    description,
}: PluginOrModMetadata) => {
    const nameComponent = <span className="title">{name}</span>;

    const authorComponent = author ? (
        <>
            {' '}
            <span className="darker">by</span> {author}
        </>
    ) : null;

    const versionComponent = version ? (
        <> {version.startsWith('v') ? version : `v${version}`}</>
    ) : null;

    const descriptionComponent = description ? (
        <>
            <br />
            {description}
        </>
    ) : null;

    return (
        <>
            {nameComponent}
            {versionComponent}
            {authorComponent}
            {descriptionComponent}
        </>
    );
};
