import React from 'react';
import sparkLogo from '../assets/spark-logo.svg';

export default function Header({ children, title = 'spark' }) {
    return (
        <header>
            <a href="/" className="logo">
                <img src={sparkLogo} alt="" width="32px" height="32px" />
                <h1>{title}</h1>
            </a>
            {children}
        </header>
    );
}
