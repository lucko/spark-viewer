import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function FaButton({ icon, onClick, title, style, children }) {
    return (
        <div
            className="button text-box"
            onClick={onClick}
            title={title}
            style={{
                width: '36px',
                ...style,
            }}
        >
            <FontAwesomeIcon icon={icon} />
            {children}
        </div>
    );
}
