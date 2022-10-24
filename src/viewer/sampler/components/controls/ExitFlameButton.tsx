import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Dispatch, SetStateAction } from 'react';
import FaButton from '../../../../components/FaButton';
import { StackTraceNode, ThreadNode } from '../../../proto/spark_pb';

export interface ExitFlameButtonProps {
    setFlameData: Dispatch<
        SetStateAction<StackTraceNode | ThreadNode | undefined>
    >;
}

export default function ExitFlameButton({
    setFlameData,
}: ExitFlameButtonProps) {
    function onClick() {
        setFlameData(undefined);
    }

    return (
        <FaButton
            icon={faTimes}
            onClick={onClick}
            title="Exit the Flame Graph view"
        />
    );
}
