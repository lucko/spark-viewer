import MappingsMenu from '../viewer/sampler/components/controls/MappingsMenu';
import { MappingsMetadata } from '../viewer/sampler/logic/mappings/fetch';
import Header from './Header';

export interface HeaderWithMappingsProps {
    mappingsMetadata?: MappingsMetadata;
    mappings: string;
    setMappings: (type: string) => void;
}

export default function HeaderWithMappings({
    mappingsMetadata,
    mappings,
    setMappings,
}: HeaderWithMappingsProps) {
    return (
        <Header title="spark viewer">
            {!!mappingsMetadata && (
                <MappingsMenu
                    mappingsMetadata={mappingsMetadata}
                    mappings={mappings}
                    setMappings={setMappings}
                />
            )}
        </Header>
    );
}
