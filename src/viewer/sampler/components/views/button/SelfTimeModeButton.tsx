import { Dispatch, SetStateAction } from 'react';
import Button from './Button';

export interface SelfTimeModeButtonProps {
    selfTimeMode: boolean;
    setSelfTimeMode: Dispatch<SetStateAction<boolean>>;
}

export default function SelfTimeModeButton({
    selfTimeMode,
    setSelfTimeMode,
}: SelfTimeModeButtonProps) {
    return (
        <Button
            value={selfTimeMode}
            setValue={setSelfTimeMode}
            title="Sort Mode"
            labelTrue="Self Time"
            labelFalse="Total Time"
        >
            <p>
                Methods are sorted according to their "self time" (the time
                spent executing code within the method)
            </p>
            <p>
                Methods are sorted according to their "total time" (the time
                spent executing code within the method and the time spent
                executing sub-calls)
            </p>
        </Button>
    );
}
