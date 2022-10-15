import {
    faChartLine,
    faEye,
    faFire,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';

import FaButton from '../components/FaButton';
import { ExportButton, ShowInfoButton } from '../viewer/controls';
import { ProfileTitle } from './meta';
import SearchBar from './search';
import { VIEW_ALL, VIEW_FLAT, VIEW_SOURCES } from './views';

import styles from '../style/controls.module.scss';

export default function Controls({
    data,
    metadataToggle,
    exportCallback,
    view,
    setView,
    graphSupported,
    showGraph,
    setShowGraph,
    flameData,
    setFlameData,
    searchQuery,
}) {
    const { metadata } = data;

    return (
        <div className={styles.controls}>
            <ProfileTitle metadata={metadata} />
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
        </div>
    );
}

const GraphButton = ({ graphSupported, showGraph, setShowGraph }) => {
    if (!graphSupported) {
        return null;
    }

    function onClick() {
        setShowGraph(state => !state);
    }

    return (
        <FaButton
            icon={faChartLine}
            onClick={onClick}
            title="View the graph"
            extraClassName={showGraph ? 'toggled' : null}
        />
    );
};

const ToggleViewButton = ({ data, view, setView }) => {
    const sourcesViewSupported =
        Object.keys(data.classSources).length ||
        Object.keys(data.methodSources).length ||
        Object.keys(data.lineSources).length;

    const supportedViews = [
        VIEW_ALL,
        VIEW_FLAT,
        ...(sourcesViewSupported ? [VIEW_SOURCES] : []),
    ];

    return supportedViews.map(v => {
        function onClick() {
            setView(v);
        }

        let label;
        if (v === VIEW_ALL) {
            label = 'all';
        } else if (v === VIEW_FLAT) {
            label = 'flat';
        } else {
            const noun = ['Fabric', 'Forge'].includes(
                data?.metadata?.platform?.name
            )
                ? 'mods'
                : 'plugins';

            label = noun;
        }

        return (
            <FaButton
                key={label}
                icon={faEye}
                onClick={onClick}
                title="Toggle the view"
                extraClassName={
                    view === v
                        ? 'sources-view-button toggled'
                        : 'sources-view-button'
                }
            >
                <span>{label}</span>
            </FaButton>
        );
    });
};

const FlameButton = ({ data, setFlameData }) => {
    if (data.threads.length !== 1) {
        return null;
    }

    function onClick() {
        setFlameData(data.threads[0]);
    }

    return (
        <FaButton
            icon={faFire}
            onClick={onClick}
            title="View the profile as a Flame Graph"
        />
    );
};

const ExitFlameButton = ({ setFlameData }) => {
    function onClick() {
        setFlameData(null);
    }

    return (
        <FaButton
            icon={faTimes}
            onClick={onClick}
            title="Exit the Flame Graph view"
        />
    );
};
