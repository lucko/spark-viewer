import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { Item, ItemParams, Menu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import { Tooltip } from 'react-tooltip';
import styles from '../../../style/sampler.module.scss';
import VersionWarning from '../../common/components/VersionWarning';
import WidgetsAndMetadata from '../../common/components/WidgetsAndMetadata';
import useMetadataToggle from '../../common/hooks/useMetadataToggle';
import useSocketClient from '../../common/hooks/useSocketClient';
import useToggle from '../../common/hooks/useToggle';
import { ExportCallback } from '../../common/logic/export';
import { SamplerMetadata } from '../../proto/spark_pb';
import useHighlight from '../hooks/useHighlight';
import useInfoPoints from '../hooks/useInfoPoints';
import useMappings from '../hooks/useMappings';
import useSearchQuery from '../hooks/useSearchQuery';
import useSocketBindings from '../hooks/useSocketBindings';
import useTimeSelector from '../hooks/useTimeSelector';
import VirtualNode from '../node/VirtualNode';
import SamplerData from '../SamplerData';
import { FlatViewData } from '../worker/FlatViewGenerator';
import RemoteSamplerWorker from '../worker/RemoteSamplerWorker';
import { SourcesViewData } from '../worker/SourceViewGenerator';
import Controls from './controls/Controls';
import Flame from './flamegraph/Flame';
import NoData from './misc/NoData';
import SocketInfo from './misc/SocketInfo';
import SamplerContext from './SamplerContext';
import SettingsMenu from './settings/SettingsMenu';
import AllView from './views/AllView';
import FlatView from './views/FlatView';
import SourcesView from './views/SourcesView';
import { View, VIEW_ALL, VIEW_FLAT } from './views/types';

const RefineGraph = dynamic(() => import('./refine/RefineGraph'));

export interface SamplerProps {
    data: SamplerData;
    fetchUpdatedData: (payloadId: string) => void;
    metadata: SamplerMetadata;
    setMetadata: (metadata: SamplerMetadata) => void;
    exportCallback: ExportCallback;
}

export default function Sampler({
    data,
    fetchUpdatedData,
    metadata,
    setMetadata,
    exportCallback,
}: SamplerProps) {
    const searchQuery = useSearchQuery(data);
    const highlighted = useHighlight();
    const [labelMode, setLabelMode] = useState(false);
    const timeSelector = useTimeSelector(
        data.timeWindows,
        data.timeWindowStatistics
    );
    const mappings = useMappings(metadata);
    const infoPoints = useInfoPoints();
    const [flameData, setFlameData] = useState<VirtualNode>();
    const [view, setView] = useState<View>(VIEW_ALL);
    const [showRefineGraph, setShowRefineGraph] = useToggle(
        'prefShowGraph',
        true
    );
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [showSocketInfo, setShowSocketInfo] = useToggle(
        'prefShowSocket',
        false
    );

    // views reference nodes by id so keep them tied to their data
    // otherwise old ids gets resolved against the new node map
    const [flatViewData, setFlatViewData] =
        useState<[SamplerData, FlatViewData]>();
    const [sourcesViewData, setSourcesViewData] =
        useState<[SamplerData, SourcesViewData]>();

    // Generate flat & sources view in the background on first load
    useEffect(() => {
        let cancelled = false;
        (async () => {
            const worker = await RemoteSamplerWorker.create(data);

            try {
                if (data.sources.hasSources()) {
                    const sourcesView = await worker.generateSourcesView();
                    if (cancelled) return;
                    setSourcesViewData([data, sourcesView]);
                }

                const flatView = await worker.generateFlatView();
                if (cancelled) return;
                setFlatViewData([data, flatView]);
            } finally {
                worker.close();
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [data]);

    // WebSocket
    const socketClient = useSocketClient(data.channelInfo, fetchUpdatedData);
    const socket = useSocketBindings({
        socket: socketClient,
        fetchUpdatedData,
        metadata,
        setMetadata,
    });

    const metadataToggle = useMetadataToggle();

    // Callback function for the "Toggle bookmark" context menu button
    function handleHighlight(args: ItemParams<{ node: VirtualNode }>) {
        if (!args.props) return;
        highlighted.toggle(args.props.node);
    }

    // Callback function for the "Clear all bookmarks" context menu button
    function handleHighlightClear() {
        highlighted.clear();
    }

    // Callback function for the "View as Flame Graph" context menu button
    function handleFlame(args: ItemParams<{ node: VirtualNode }>) {
        const node = args.props?.node;
        if (!node) return;
        setFlameData(node);
    }

    const supported =
        metadata?.platform?.sparkVersion && metadata.platform.sparkVersion >= 2;

    return (
        <div className={styles.sampler}>
            <Controls
                data={data}
                metadata={metadata}
                metadataToggle={metadataToggle}
                exportCallback={exportCallback}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
                view={view}
                setView={setView}
                sourcesViewSupported={data.sources.hasSources()}
                refineGraphSupported={timeSelector.supported}
                showRefineGraph={showRefineGraph}
                setShowRefineGraph={setShowRefineGraph}
                socket={socket}
                showSocketInfo={showSocketInfo}
                setShowSocketInfo={setShowSocketInfo}
                flameData={flameData}
                setFlameData={setFlameData}
                searchQuery={searchQuery}
            />

            {showSettings && (
                <SettingsMenu
                    mappingsMetadata={mappings.mappingsMetadata}
                    mappings={mappings.mappingsType}
                    setMappings={mappings.requestMappings}
                    infoPoints={infoPoints.enabled}
                    toggleInfoPoints={infoPoints.toggleEnabled}
                />
            )}

            {showSocketInfo && socket.socket.socket && (
                <SocketInfo socket={socket} />
            )}

            {!supported && <VersionWarning />}

            <WidgetsAndMetadata
                metadata={metadata}
                metadataToggle={metadataToggle}
            />

            {timeSelector.supported && (
                <Suspense fallback={null}>
                    <RefineGraph
                        show={showRefineGraph}
                        timeSelector={timeSelector}
                        windowStatistics={data.timeWindowStatistics}
                    />
                </Suspense>
            )}

            {!!flameData && (
                <Flame
                    flameData={flameData}
                    mappings={mappings.mappingsResolver}
                    metadata={metadata}
                    timeSelector={timeSelector}
                />
            )}

            <div style={{ display: flameData ? 'none' : undefined }}>
                <SamplerContext
                    mappings={mappings.mappingsResolver}
                    infoPoints={infoPoints}
                    highlighted={highlighted}
                    searchQuery={searchQuery}
                    labelMode={labelMode}
                    metadata={metadata}
                    timeSelector={timeSelector}
                >
                    {view === VIEW_ALL ? (
                        <AllView data={data} setLabelMode={setLabelMode} />
                    ) : view === VIEW_FLAT ? (
                        <FlatView
                            data={flatViewData?.[0] ?? data}
                            viewData={flatViewData?.[1]}
                            setLabelMode={setLabelMode}
                        />
                    ) : (
                        <SourcesView
                            data={sourcesViewData?.[0] ?? data}
                            viewData={sourcesViewData?.[1]}
                            setLabelMode={setLabelMode}
                        />
                    )}
                    {infoPoints.enabled && (
                        <Tooltip
                            id="infopoint-tooltip"
                            place="right"
                            className="infopoint-tooltip"
                            clickable
                        />
                    )}
                </SamplerContext>
            </div>

            {data.threads.length === 0 && (
                <NoData isConnectedToSocket={!!socket.socket.socket} />
            )}

            <Menu id={'sampler-cm'} theme="dark">
                <Item onClick={handleFlame}>View as Flame Graph</Item>
                <Item onClick={handleHighlight}>Toggle bookmark</Item>
                <Item onClick={handleHighlightClear}>Clear all bookmarks</Item>
            </Menu>
        </div>
    );
}
