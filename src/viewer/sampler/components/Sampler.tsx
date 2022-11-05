import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { Item, ItemParams, Menu, theme } from 'react-contexify';
import styles from '../../../style/sampler.module.scss';
import VersionWarning from '../../common/components/VersionWarning';
import WidgetsAndMetadata from '../../common/components/WidgetsAndMetadata';
import useMetadataToggle from '../../common/hooks/useMetadataToggle';
import useToggle from '../../common/hooks/useToggle';
import { ExtendedThreadNode } from '../../proto/nodes';
import { SamplerData, StackTraceNode, ThreadNode } from '../../proto/spark_pb';
import useHighlight from '../hooks/useHighlight';
import useSearchQuery from '../hooks/useSearchQuery';
import useTimeSelector from '../hooks/useTimeSelector';
import { MappingsResolver } from '../mappings/resolver';
import { createWorker } from '../preprocessing/preprocessing';
import {
    FlatViewDataContainer,
    SourcesViewDataContainer,
} from '../preprocessing/preprocessingWorker';
import Controls from './controls/Controls';
import Flame from './flamegraph/Flame';
import SamplerContext from './SamplerContext';
import AllView from './views/AllView';
import FlatView from './views/FlatView';
import SourcesView from './views/SourcesView';
import { View, VIEW_ALL, VIEW_FLAT } from './views/types';

import 'react-contexify/dist/ReactContexify.css';
import { ExportCallback } from '../../common/logic/export';

const Graph = dynamic(() => import('./graph/Graph'));

export interface SamplerProps {
    data: SamplerData;
    mappings: MappingsResolver;
    exportCallback: ExportCallback;
}

export default function Sampler({
    data,
    mappings,
    exportCallback,
}: SamplerProps) {
    const searchQuery = useSearchQuery();
    const highlighted = useHighlight();
    const [labelMode, setLabelMode] = useState(false);
    const timeSelector = useTimeSelector(
        data.timeWindows,
        data.timeWindowStatistics
    );

    const [flameData, setFlameData] = useState<StackTraceNode | ThreadNode>();
    const [view, setView] = useState<View>(VIEW_ALL);
    const [showGraph, setShowGraph] = useToggle('prefShowGraph', true);

    const [flatViewData, setFlatViewData] = useState<FlatViewDataContainer>({});
    const [sourcesViewData, setSourcesViewData] =
        useState<SourcesViewDataContainer>({});

    // Generate flat & sources view in the background on first load
    useEffect(() => {
        createWorker(worker => {
            worker.generateFlatView(data).then(res => {
                setFlatViewData(res);
            });
        });
        createWorker(worker => {
            worker.generateSourceViews(data).then(res => {
                setSourcesViewData(res);
            });
        });
    }, [data]);

    const metadataToggle = useMetadataToggle();

    // Callback function for the "Toggle bookmark" context menu button
    function handleHighlight(args: ItemParams) {
        highlighted.toggle(args.props.node.id);
    }

    // Callback function for the "Clear all bookmarks" context menu button
    function handleHighlightClear() {
        highlighted.clear();
    }

    // Callback function for the "View as Flame Graph" context menu button
    function handleFlame(args: ItemParams) {
        setFlameData(args.props.node);
    }

    const supported =
        data.metadata?.platform?.sparkVersion &&
        data.metadata.platform.sparkVersion >= 2;

    return (
        <div className={styles.sampler}>
            <Controls
                data={data}
                metadataToggle={metadataToggle}
                exportCallback={exportCallback}
                view={view}
                setView={setView}
                graphSupported={timeSelector.supported}
                showGraph={showGraph}
                setShowGraph={setShowGraph}
                flameData={flameData}
                setFlameData={setFlameData}
                searchQuery={searchQuery}
            />

            {!supported && <VersionWarning />}

            <WidgetsAndMetadata
                metadata={data.metadata!}
                metadataToggle={metadataToggle}
            />

            {timeSelector.supported && (
                <Suspense fallback={null}>
                    <Graph
                        show={showGraph}
                        timeSelector={timeSelector}
                        windowStatistics={data.timeWindowStatistics}
                    />
                </Suspense>
            )}

            {!!flameData && (
                <Flame
                    flameData={flameData}
                    mappings={mappings}
                    timeSelector={timeSelector}
                />
            )}

            <div style={{ display: flameData ? 'none' : undefined }}>
                <SamplerContext
                    mappings={mappings}
                    highlighted={highlighted}
                    searchQuery={searchQuery}
                    labelMode={labelMode}
                    metadata={data.metadata!}
                    timeSelector={timeSelector}
                >
                    {view === VIEW_ALL ? (
                        <AllView
                            threads={data.threads as ExtendedThreadNode[]}
                            setLabelMode={setLabelMode}
                        />
                    ) : view === VIEW_FLAT ? (
                        <FlatView
                            dataSelfTime={
                                flatViewData.flatSelfTime as ExtendedThreadNode[]
                            }
                            dataTotalTime={
                                flatViewData.flatTotalTime as ExtendedThreadNode[]
                            }
                            setLabelMode={setLabelMode}
                        />
                    ) : (
                        <SourcesView
                            dataMerged={sourcesViewData.sourcesMerged}
                            dataSeparate={sourcesViewData.sourcesSeparate}
                            setLabelMode={setLabelMode}
                        />
                    )}
                </SamplerContext>
            </div>

            <Menu id={'sampler-cm'} theme={theme.dark}>
                <Item onClick={handleFlame}>View as Flame Graph</Item>
                <Item onClick={handleHighlight}>Toggle bookmark</Item>
                <Item onClick={handleHighlightClear}>Clear all bookmarks</Item>
            </Menu>
        </div>
    );
}
