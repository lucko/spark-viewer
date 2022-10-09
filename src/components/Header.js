import SparkLogo from '../assets/spark-logo.svg';

export default function Header({ children, title = 'spark' }) {
    return (
        <header>
            <a href="/" className="logo">
                <SparkLogo width="2.5em" height="2.5em" />
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
                <SparkLogo />
                <div>
                    <h1>spark</h1>
                    <div>
                        A performance profiler for Minecraft
                        <br />
                        clients, servers, and proxies.
                    </div>
                </div>
            </div>
        </div>
    );
}
