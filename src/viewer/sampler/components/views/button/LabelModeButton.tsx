import { Dispatch, SetStateAction, useContext } from 'react';
import { SamplerMetadata_SamplerMode } from '../../../../proto/spark_pb';
import { MetadataContext } from '../../SamplerContext';
import Button from './Button';

export interface LabelModeButtonProps {
    labelMode: boolean;
    setLabelMode: Dispatch<SetStateAction<boolean>>;
}

export default function LabelModeButton({
    labelMode,
    setLabelMode,
}: LabelModeButtonProps) {
    const metadata = useContext(MetadataContext)!;
    const isAllocationProfile =
        metadata.samplerMode === SamplerMetadata_SamplerMode.ALLOCATION;

    if (!isAllocationProfile && !metadata.numberOfTicks) {
        return null;
    }

    const isLockProfile =
        metadata.samplerMode === SamplerMetadata_SamplerMode.LOCK;

    if (isLockProfile) {
        return (
            <Button
                value={labelMode}
                setValue={setLabelMode}
                title="Label"
                labelTrue="Wait time per tick"
                labelFalse="Percentage"
            >
                <p>
                    The value displayed against each frame is the average time
                    in milliseconds spent waiting to acquire locks each tick.
                </p>
                <p>
                    The value displayed against each frame is the time spent
                    waiting to acquire locks divided by the total wait time as a
                    percentage.
                </p>
            </Button>
        );
    }

    if (isAllocationProfile) {
        return (
            <Button
                value={labelMode}
                setValue={setLabelMode}
                title="Label"
                labelTrue="Bytes per second"
                labelFalse="Percentage"
            >
                <p>
                    The value displayed is the number of bytes of memory
                    allocated per second on average (memory pressure) by each
                    frame.
                </p>
                <p>
                    The value displayed is number of bytes of memory allocated
                    by each frame divided by the total allocated as a
                    percentage.
                </p>
            </Button>
        );
    } else {
        return (
            <Button
                value={labelMode}
                setValue={setLabelMode}
                title="Label"
                labelTrue="Time per tick"
                labelFalse="Percentage"
            >
                <p>
                    The value displayed against each frame is the average time
                    in milliseconds spent executing the method each tick.
                </p>
                <p>
                    The value displayed against each frame is the time divided
                    by the total time as a percentage.
                </p>
            </Button>
        );
    }
}
