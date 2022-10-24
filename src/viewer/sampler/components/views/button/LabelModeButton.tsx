import { Dispatch, SetStateAction, useContext } from 'react';
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
    if (!metadata.numberOfTicks) {
        return null;
    }

    return (
        <Button
            value={labelMode}
            setValue={setLabelMode}
            title="Label"
            labelTrue="Time per tick"
            labelFalse="Percentage"
        >
            <p>
                The value displayed against each frame is the average time in
                milliseconds spent executing the method each tick.
            </p>
            <p>
                The value displayed against each frame is the time divided by
                the total time as a percentage.
            </p>
        </Button>
    );
}
