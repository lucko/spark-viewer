import { Dispatch, SetStateAction } from 'react';
import styles from '../../../../style/controls.module.scss';
import ExportButton from '../../../common/components/controls/ExportButton';
import ShowInfoButton from '../../../common/components/controls/ShowInfoButton';
import { MetadataToggle } from '../../../common/hooks/useMetadataToggle';
import { ExportCallback } from '../../../common/logic/export';
import {
    SamplerData,
    SamplerMetadata,
    StackTraceNode,
    ThreadNode,
} from '../../../proto/spark_pb';
import { SearchQuery } from '../../hooks/useSearchQuery';
import { SocketBinding } from '../../hooks/useSocketBindings';
import SamplerTitle from '../SamplerTitle';
import { View } from '../views/types';
import ExitFlameButton from './ExitFlameButton';
import FlameButton from './FlameButton';
import GraphButton from './GraphButton';
import LastUpdateSpinner from './LastUpdateSpinner';
import SearchBar from './SearchBar';
import ToggleViewButton from './ToggleViewButton';

export interface ControlsProps {
    data: SamplerData;
    metadata: SamplerMetadata;
    metadataToggle: MetadataToggle;
    exportCallback: ExportCallback;
    view: View;
    setView: Dispatch<SetStateAction<View>>;
    graphSupported: boolean;
    showGraph: boolean;
    setShowGraph: Dispatch<SetStateAction<boolean>>;
    showSocketInfo: boolean;
    setShowSocketInfo: Dispatch<SetStateAction<boolean>>;
    socketBinding?: SocketBinding;
    flameData?: StackTraceNode | ThreadNode;
    setFlameData: Dispatch<
        SetStateAction<StackTraceNode | ThreadNode | undefined>
    >;
    searchQuery: SearchQuery;
}

export default function Controls({
    data,
    metadata,
    metadataToggle,
    exportCallback,
    view,
    setView,
    graphSupported,
    showGraph,
    setShowGraph,
    showSocketInfo,
    setShowSocketInfo,
    socketBinding,
    flameData,
    setFlameData,
    searchQuery,
}: ControlsProps) {
    return (
        <div className={styles.controls}>
            <SamplerTitle metadata={metadata} />
            <ShowInfoButton
                metadata={metadata}
                metadataToggle={metadataToggle}
            />
            <GraphButton
                graphSupported={graphSupported}
                showGraph={showGraph}
                setShowGraph={setShowGraph}
            />
            {!flameData ? (
                <>
                    <ToggleViewButton
                        data={data}
                        metadata={metadata}
                        view={view}
                        setView={setView}
                    />
                    <FlameButton data={data} setFlameData={setFlameData} />
                    <ExportButton exportCallback={exportCallback} />
                    <SearchBar searchQuery={searchQuery} />
                </>
            ) : (
                <ExitFlameButton setFlameData={setFlameData} />
            )}
            <LastUpdateSpinner
                showSocketInfo={showSocketInfo}
                setShowSocketInfo={setShowSocketInfo}
                socketBinding={socketBinding}
            />
        </div>
    );
}
