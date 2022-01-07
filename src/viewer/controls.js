import React from 'react';

import { faInfoCircle, faFileExport } from '@fortawesome/free-solid-svg-icons';

import FaButton from '../components/FaButton';

export const metadataDetailModes = [
    // cycle: widgets -> widgets+extra -> widgets -> nothing -> widgets
    { idx: 0, widgets: true, extraWidgets: false },
    { idx: 1, widgets: true, extraWidgets: true },
    { idx: 2, widgets: true, extraWidgets: false },
    { idx: 3, widgets: false, extraWidgets: false },
];

export const ShowInfoButton = ({
    metadata,
    showMetadataDetail,
    setShowMetadataDetail,
}) => {
    if (!metadata.platform) {
        return null;
    }

    function onClick() {
        setShowMetadataDetail(
            metadataDetailModes[
                (showMetadataDetail.idx + 1) % metadataDetailModes.length
            ]
        );
    }

    return (
        <FaButton
            icon={faInfoCircle}
            onClick={onClick}
            title="Click to cycle between the widgets/metadata views"
        />
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
