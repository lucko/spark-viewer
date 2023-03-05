import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Dispatch, SetStateAction } from 'react';
import FaButton from '../../../../components/FaButton';
import VirtualNode from '../../node/VirtualNode';

export interface ExitFlameButtonProps {
    setFlameData: Dispatch<SetStateAction<VirtualNode | undefined>>;
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
