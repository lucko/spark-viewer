import { useState } from 'react';
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
    const [showBuiltinPlugins, setShowBuiltinPlugins] =
        useState<boolean>(false);
    const hasBuiltinPlugins = plugins.some(plugin => plugin.builtIn);
    const filteredPlugins = showBuiltinPlugins
        ? plugins
        : plugins.filter(p => !p.builtIn);

    const [showBuiltinDataPacks, setShowBuiltinDataPacks] =
        useState<boolean>(false);
    const hasBuiltinDataPacks = dataPacks.some(pack => pack.builtIn);
    const filteredDataPacks = showBuiltinDataPacks
        ? dataPacks
        : dataPacks.filter(p => !p.builtIn);

    return (
        <div className="plugins-mods-list">
            {!!plugins.length && (
                <>
                    <h2>Plugins/Mods</h2>
                    {hasBuiltinPlugins && (
                        <button
                            onClick={() =>
                                setShowBuiltinPlugins(value => !value)
                            }
                        >
                            {showBuiltinPlugins ? 'Hide' : 'Show'} built-in
                            plugins
                        </button>
                    )}
                    <ul>
                        {filteredPlugins.map(plugin => (
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
                    {hasBuiltinDataPacks && (
                        <button
                            onClick={() =>
                                setShowBuiltinDataPacks(value => !value)
                            }
                        >
                            {showBuiltinDataPacks ? 'Hide' : 'Show'} built-in
                            Data Packs
                        </button>
                    )}
                    <ul>
                        {filteredDataPacks.map(pack => (
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
