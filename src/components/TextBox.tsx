import classNames from 'classnames';
import { ReactNode } from 'react';

export interface TextBoxProps {
    children: ReactNode;
    extraClassName?: string;
}

export default function TextBox({ children, extraClassName }: TextBoxProps) {
    const className = classNames('textbox', extraClassName);
    return <div className={className}>{children}</div>;
}
