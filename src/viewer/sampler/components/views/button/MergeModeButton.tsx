import { Dispatch, SetStateAction } from 'react';
import Button from './Button';

export interface MergeModeButtonProps {
    merged: boolean;
    setMerged: Dispatch<SetStateAction<boolean>>;
}

export default function MergeModeButton({
    merged,
    setMerged,
}: MergeModeButtonProps) {
    return (
        <Button
            value={merged}
            setValue={setMerged}
            title="Merge Mode"
            labelTrue="Merge"
            labelFalse="Separate"
        >
            <p>
                Method calls with the same signature will be merged together,
                even though they may not have been invoked by the same calling
                method.
            </p>
            <p>
                Method calls that have the same signature, but that haven&apos;t
                been invoked by the same calling method will show separately.
            </p>
        </Button>
    );
}
