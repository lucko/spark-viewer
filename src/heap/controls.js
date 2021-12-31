import React from 'react';

import { ExportButton, ShowInfoButton } from '../viewer/controls';
import { HeapTitle } from './meta';

export default function Controls({
    data,
    showMetadataDetail,
    setShowMetadataDetail,
    exportCallback,
}) {
    const { metadata } = data;

    return (
        <div className="controls">
            <ShowInfoButton
                metadata={metadata}
                showMetadataDetail={showMetadataDetail}
                setShowMetadataDetail={setShowMetadataDetail}
            />
            <HeapTitle metadata={metadata} />
            <ExportButton exportCallback={exportCallback} />
        </div>
    );
}
