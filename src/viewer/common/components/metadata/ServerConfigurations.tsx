import ConfigurationObject from './ConfigurationObject';

export interface ServerConfigurationsProps {
    parsedConfigurations: Record<string, any>;
}

export default function ServerConfigurations({
    parsedConfigurations,
}: ServerConfigurationsProps) {
    return (
        <div className="configurations">
            <p>The server is using the following configuration settings:</p>
            <ConfigurationObject data={parsedConfigurations} />
        </div>
    );
}
