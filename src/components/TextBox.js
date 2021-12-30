import React from 'react';

export default function TextBox({ children, style = {} }) {
    return (
        <div className="text-box" style={style}>
            {children}
        </div>
    );
}
