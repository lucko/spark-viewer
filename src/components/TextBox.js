import React from 'react';
import classNames from 'classnames';

export default function TextBox({ children, extraClassName }) {
    const className = classNames('text-box', extraClassName);
    return (
        <div className={className}>
            {children}
        </div>
    );
}
