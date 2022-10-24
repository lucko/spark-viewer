import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

export interface ConfigurationObjectProps {
    data: Record<string, any>;
}

export default function ConfigurationObject({
    data,
}: ConfigurationObjectProps) {
    return (
        <ul>
            {Object.entries(data).map(([name, value], i) =>
                typeof value === 'object' ? (
                    <ObjectValue key={i} name={name} value={value} />
                ) : (
                    <ScalarValue key={i} name={name} value={value} />
                )
            )}
        </ul>
    );
}

const ObjectValue = ({
    name,
    value,
}: {
    name: string;
    value: Record<any, any>;
}) => {
    const [open, setOpen] = useState(false);

    function click() {
        setOpen(!open);
    }

    return (
        <li>
            <span style={{ cursor: 'pointer' }} onClick={click}>
                {name}{' '}
                <FontAwesomeIcon icon={open ? faMinusSquare : faPlusSquare} />
            </span>
            {open && <ConfigurationObject data={value} />}
        </li>
    );
};

const ScalarValue = ({ name, value }: { name: string; value: any }) => {
    return (
        <li>
            {name}:{' '}
            <span className={'type-' + typeof value}>{String(value)}</span>
        </li>
    );
};
