import React, { useCallback, useEffect, useState } from 'react';

import {
    faInfoCircle,
    faFileExport,
    faGauge,
} from '@fortawesome/free-solid-svg-icons';

import FaButton from '../components/FaButton';

export const ShowInfoButton = ({ metadata, metadataToggle }) => {
    if (!metadata.platform) {
        return null;
    }

    return (
        <>
            <FaButton
                icon={faGauge}
                onClick={metadataToggle.toggleWidgets}
                title="Click to toggle the widgets"
                extraClassName={metadataToggle.showWidgets ? 'toggled' : null}
            />
            <FaButton
                icon={faInfoCircle}
                onClick={metadataToggle.toggleInfo}
                title="Click to toggle the detailed metadata display"
                extraClassName={metadataToggle.showInfo ? 'toggled' : null}
            />
        </>
    );
};

export const ExportButton = ({ exportCallback }) => {
    if (!exportCallback) {
        return null;
    }
    return (
        <FaButton
            icon={faFileExport}
            onClick={exportCallback}
            title="Export this profile to a local file"
        />
    );
};

export function useMetadataToggle() {
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

function useToggle(name, defaultValue) {
    const [value, setValue] = useState(() => {
        const pref = localStorage.getItem(name);
        return pref !== null ? !!pref : defaultValue;
    });

    useEffect(() => {
        localStorage.setItem(name, value);
    }, [name, value]);

    const toggle = useCallback(() => {
        setValue(prev => !prev);
    }, [setValue]);

    return [value, setValue, toggle];
}
