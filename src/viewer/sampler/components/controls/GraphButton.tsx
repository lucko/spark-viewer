import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Dispatch, SetStateAction } from 'react';
import FaButton from '../../../../components/FaButton';

export interface GraphButtonProps {
    graphSupported: boolean;
    showGraph: boolean;
    setShowGraph: Dispatch<SetStateAction<boolean>>;
}

export default function GraphButton({
    graphSupported,
    showGraph,
    setShowGraph,
}: GraphButtonProps) {
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
            extraClassName={showGraph ? 'toggled' : undefined}
        />
    );
}
