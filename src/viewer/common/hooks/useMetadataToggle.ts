import { useEffect } from 'react';
import useToggle from './useToggle';

export interface MetadataToggle {
    showWidgets: boolean;
    showInfo: boolean;
    showMetrics: boolean;
    toggleWidgets: () => void;
    toggleInfo: () => void;
    toggleMetrics: () => void;
}

export default function useMetadataToggle(): MetadataToggle {
    const [showWidgets, setShowWidgets, toggleWidgets] = useToggle(
        'prefShowWidgets',
        true
    );
    const [showInfo, setShowInfo, toggleInfo] = useToggle(
        'prefShowInfo',
        false
    );
    const [showMetrics, setShowMetrics, toggleMetrics] = useToggle(
        'prefShowMetrics',
        false
    );

    useEffect(() => {
        if (!showWidgets) {
            setShowInfo(false);
        }
    }, [showWidgets, setShowInfo]);

    useEffect(() => {
        if (showInfo) {
            setShowWidgets(true);
        }
    }, [showInfo, setShowWidgets]);

    return {
        showWidgets,
        showInfo,
        showMetrics,
        toggleWidgets,
        toggleInfo,
        toggleMetrics,
    };
}

export function useAlwaysOpenMetadataToggle(): MetadataToggle {
    return {
        showWidgets: true,
        showInfo: true,
        showMetrics: true,
        toggleWidgets: () => {},
        toggleInfo: () => {},
        toggleMetrics: () => {},
    };
}
