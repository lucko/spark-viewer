import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { MouseEventHandler, ReactNode } from 'react';

export interface FaButtonProps {
    icon: IconProp;
    onClick: MouseEventHandler<HTMLDivElement>;
    title: string;
    extraClassName?: string;
    children?: ReactNode;
}

export default function FaButton({
    icon,
    onClick,
    title,
    extraClassName,
    children,
}: FaButtonProps) {
    const className = classNames('button', 'textbox', extraClassName);
    return (
        <div className={className} onClick={onClick} title={title}>
            <FontAwesomeIcon icon={icon} />
            {children}
        </div>
    );
}
