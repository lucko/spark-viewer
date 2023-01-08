import { Dispatch, SetStateAction, useContext, useState } from 'react';
import TextBox from '../../../../components/TextBox';
import {
    ExtendedThreadNode,
    ThreadNodeWithSourceTime,
} from '../../../proto/nodes';
import { SourcesViewData } from '../../preprocessing/preprocessingWorker';
import { LabelModeContext, MetadataContext } from '../SamplerContext';
import BaseNode from '../tree/BaseNode';
import LabelModeButton from './button/LabelModeButton';
import MergeModeButton from './button/MergeModeButton';
import SourcesViewHeader from './header/SourcesViewHeader';

export interface SourcesViewProps {
    dataMerged?: SourcesViewData[];
    dataSeparate?: SourcesViewData[];
    setLabelMode: Dispatch<SetStateAction<boolean>>;
}

// The sampler view in which there is a stack displayed for each known source.
export default function SourcesView({
    dataMerged,
    dataSeparate,
    setLabelMode,
}: SourcesViewProps) {
    const labelMode = useContext(LabelModeContext);
    const [merged, setMerged] = useState(true);
    const data = merged ? dataMerged : dataSeparate;

    return (
        <div className="sourceview">
            <SourcesViewHeader>
                <LabelModeButton
                    labelMode={labelMode}
                    setLabelMode={setLabelMode}
                />
                <MergeModeButton merged={merged} setMerged={setMerged} />
            </SourcesViewHeader>
            <hr />
            {!data ? (
                <TextBox>Loading...</TextBox>
            ) : (
                <>
                    {data.map(({ source, totalTime, threads }) => (
                        <SourceSection
                            source={source}
                            totalTime={totalTime}
                            threads={threads}
                            key={source}
                        />
                    ))}
                    <OtherSourcesSection data={data} />
                </>
            )}
        </div>
    );
}

const formatVersion = (version: string) => {
    return version.startsWith('v') ? version : 'v' + version;
};

const SourceSection = ({
    source,
    totalTime,
    threads,
}: {
    source: string;
    totalTime: number;
    threads: ThreadNodeWithSourceTime[];
}) => {
    const metadata = useContext(MetadataContext)!;
    const sourceInfo = metadata.sources[source.toLowerCase()];

    return (
        <div className="stack">
            <h2>
                {source}{' '}
                {sourceInfo && (
                    <span className="version">
                        ({formatVersion(sourceInfo.version)})
                    </span>
                )}
            </h2>
            {threads.map(thread => (
                <BaseNode
                    parents={[]}
                    node={thread as ExtendedThreadNode}
                    isSourceRoot={true}
                    key={thread.name}
                />
            ))}
        </div>
    );
};

const OtherSourcesSection = ({ data }: { data: SourcesViewData[] }) => {
    const metadata = useContext(MetadataContext)!;
    if (!metadata.sources) {
        return null;
    }

    const alreadyShown = data.map(s => s.source);
    const otherSources = Object.values(metadata.sources).filter(
        source => !alreadyShown.includes(source.name)
    );

    if (!otherSources.length) {
        return null;
    }

    const sourceNoun = ['Fabric', 'Forge'].includes(metadata?.platform?.name!)
        ? 'mods'
        : 'plugins';

    return (
        <div className="other-sources">
            <h2>Other</h2>
            <p>
                The following other {sourceNoun} are installed, but didn&apos;t
                show up in this profile. Yay!
            </p>
            <ul>
                {otherSources.map(({ name, version }) => (
                    <li key={name}>
                        {name} <span>({formatVersion(version)})</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
