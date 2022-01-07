import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

export default function FaButton({
    icon,
    onClick,
    title,
    extraClassName,
    children,
}) {
    const className = classNames('button', 'text-box', extraClassName);
    return (
        <div className={className} onClick={onClick} title={title}>
            <FontAwesomeIcon icon={icon} />
            {children}
        </div>
    );
}
