import { Dispatch, SetStateAction, useContext } from 'react';
import { SamplerMetadata_SamplerMode } from '../../../../proto/spark_pb';
import { MetadataContext } from '../../SamplerContext';
import Button from './Button';

export interface SelfTimeModeButtonProps {
    selfTimeMode: boolean;
    setSelfTimeMode: Dispatch<SetStateAction<boolean>>;
}

export default function SelfTimeModeButton({
    selfTimeMode,
    setSelfTimeMode,
}: SelfTimeModeButtonProps) {
    const metadata = useContext(MetadataContext)!;

    if (metadata.samplerMode === SamplerMetadata_SamplerMode.ALLOCATION) {
        return (
            <Button
                value={selfTimeMode}
                setValue={setSelfTimeMode}
                title="Sort Mode"
                labelTrue="Self bytes allocated"
                labelFalse="Total bytes allocated"
            >
                <p>
                    Methods are sorted according to the number of bytes of
                    memory allocated directly within the method
                </p>
                <p>
                    Methods are sorted according to the number of bytes of
                    memory allocated directly within the method as well as
                    allocations in sub-calls
                </p>
            </Button>
        );
    } else {
        return (
            <Button
                value={selfTimeMode}
                setValue={setSelfTimeMode}
                title="Sort Mode"
                labelTrue="Self Time"
                labelFalse="Total Time"
            >
                <p>
                    Methods are sorted according to their &#39;self time&#39;
                    (the time spent executing code within the method)
                </p>
                <p>
                    Methods are sorted according to their &#39;total time&#39;
                    (the time spent executing code within the method and the
                    time spent executing sub-calls)
                </p>
            </Button>
        );
    }
}
