import { Dispatch, SetStateAction } from 'react';
import Button from './Button';

export interface BottomUpButtonProps {
    bottomUp: boolean;
    setBottomUp: Dispatch<SetStateAction<boolean>>;
}

export default function BottomUpButton({
    bottomUp,
    setBottomUp,
}: BottomUpButtonProps) {
    return (
        <Button
            value={bottomUp}
            setValue={setBottomUp}
            title="Display"
            labelTrue="Bottom Up"
            labelFalse="Top Down"
        >
            <p>
                The call tree is reversed - expanding a node reveals the method
                that called it.
            </p>
            <p>
                The call tree is "normal" - expanding a node reveals the
                sub-methods that it calls.
            </p>
        </Button>
    );
}
