import { useEffect } from 'react';
import useToggle from './useToggle';

export interface MetadataToggle {
    showWidgets: boolean;
    showInfo: boolean;
    toggleWidgets: () => void;
    toggleInfo: () => void;
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

    return { showWidgets, showInfo, toggleWidgets, toggleInfo };
}
