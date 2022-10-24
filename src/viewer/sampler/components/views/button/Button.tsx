import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch, ReactNode, SetStateAction } from 'react';

export interface ButtonProps {
    value: boolean;
    setValue: Dispatch<SetStateAction<boolean>>;
    title: string;
    labelTrue: string;
    labelFalse: string;
    children: ReactNode[];
}

export default function Button({
    value,
    setValue,
    title,
    labelTrue,
    labelFalse,
    children,
}: ButtonProps) {
    function onClick() {
        setValue(!value);
    }

    return (
        <div className="button">
            <button onClick={onClick}>
                <FontAwesomeIcon icon={faCogs} /> <span>{title}:</span>{' '}
                {value ? labelTrue : labelFalse}
            </button>
            {value ? children[0] : children[1]}
        </div>
    );
}
