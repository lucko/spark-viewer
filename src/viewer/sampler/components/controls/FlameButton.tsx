import { faFire } from '@fortawesome/free-solid-svg-icons';
import { Dispatch, SetStateAction } from 'react';
import FaButton from '../../../../components/FaButton';
import {
    SamplerData,
    StackTraceNode,
    ThreadNode,
} from '../../../proto/spark_pb';

export interface FlameButtonProps {
    data: SamplerData;
    setFlameData: Dispatch<
        SetStateAction<StackTraceNode | ThreadNode | undefined>
    >;
}

export default function FlameButton({ data, setFlameData }: FlameButtonProps) {
    if (data.threads.length !== 1) {
        return null;
    }

    function onClick() {
        setFlameData(data.threads[0]);
    }

    return (
        <FaButton
            icon={faFire}
            onClick={onClick}
            title="View the profile as a Flame Graph"
        />
    );
}
