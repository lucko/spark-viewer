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

export function HomepageHeader() {
    return (
        <div className="homepage-header">
            <div>
                <img src={sparkLogo} alt="" />
                <div>
                    <h1>spark</h1>
                    <div>
                        A performance profiler for Minecraft
                        <br />
                        clients, servers and proxies.
                    </div>
                </div>
            </div>
        </div>
    );
}
