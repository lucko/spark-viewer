import { SystemStatistics as SystemStatisticsProto } from '../../../proto/spark_pb';

export interface JvmStartupArgsProps {
    systemStatistics: SystemStatisticsProto;
}

export default function JvmStartupArgs({
    systemStatistics,
}: JvmStartupArgsProps) {
    return (
        <p>
            The JVM was started with the following arguments:
            <br />
            <br />
            <span
                style={{
                    maxWidth: '1000px',
                    display: 'inline-block',
                    color: 'inherit',
                }}
            >
                {systemStatistics.java!.vmArgs}
            </span>
        </p>
    );
}
