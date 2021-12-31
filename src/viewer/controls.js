import React from 'react';

import { faInfoCircle, faFileExport } from '@fortawesome/free-solid-svg-icons';

import FaButton from '../components/FaButton';

export const ShowInfoButton = ({
    metadata,
    showMetadataDetail,
    setShowMetadataDetail,
}) => {
    if (!metadata.platform) {
        return null;
    }

    function onClick() {
        setShowMetadataDetail(!showMetadataDetail);
    }

    return (
        <FaButton
            icon={faInfoCircle}
            onClick={onClick}
            title={
                !showMetadataDetail
                    ? 'Click to show more information and statistics about the system'
                    : 'Click to hide extra information'
            }
            style={{ color: showMetadataDetail ? 'white' : undefined }}
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
