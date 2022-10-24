import ConfigurationObject from './ConfigurationObject';

export interface ExtraPlatformMetadataProps {
    data: Record<string, any>;
}

export default function ExtraPlatformMetadata({
    data,
}: ExtraPlatformMetadataProps) {
    return (
        <div className="configurations">
            <p>Some extra metadata was provided by the platform:</p>
            <ConfigurationObject data={data} />
        </div>
    );
}
