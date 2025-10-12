import {
    PluginOrModMetadata,
    WorldStatistics_DataPack,
} from '../../../proto/spark_pb';

export interface PluginsModsListProps {
    plugins: PluginOrModMetadata[];
    dataPacks: WorldStatistics_DataPack[];
}

export default function PluginsModsList({
    plugins,
    dataPacks,
}: PluginsModsListProps) {
    return (
        <div className="plugins-mods-list">
            {!!plugins.length && (
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
            {!!dataPacks.length && (
                <>
                    <h2>Data Packs</h2>
                    <ul>
                        {dataPacks.map(pack => (
                            <li key={pack.name}>
                                <Datapack {...pack} />
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
