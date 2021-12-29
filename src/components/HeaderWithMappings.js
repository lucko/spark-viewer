import React from 'react';
import MappingsMenu from '../sampler/mappings';
import Header from './Header';

export default function HeaderWithMappings({
    isViewer,
    mappingsInfo,
    mappings,
    setMappings,
}) {
    return (
        <Header isViewer={isViewer} title="spark viewer">
            {!!mappingsInfo && (
                <MappingsMenu {...{ mappingsInfo, mappings, setMappings }} />
            )}
        </Header>
    );
}
