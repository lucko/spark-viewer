import React from 'react';

export default function Homepage() {
    return (
        <div className="homepage page">
            <h1>spark</h1>
            <p className="tagline">
                spark is a performance profiling plugin/mod for Minecraft
                clients, servers and proxies.
            </p>
            <p>spark is made up of three separate components:</p>
            <ul>
                <li>
                    <b>CPU Profiler</b>: Diagnose performance issues.
                </li>
                <li>
                    <b>Memory Inspection</b>: Diagnose memory issues.
                </li>
                <li>
                    <b>Server Health Reporting</b>: Keep track of overall server
                    health.
                </li>
            </ul>
            <h2>Links</h2>
            <p>
                There are a number of other useful resources available for
                spark.
            </p>
            <ul className="links">
                <li>
                    <a href="https://spark.lucko.me/docs">documentation</a> can
                    be found on the docs site.
                </li>
                <li>
                    <a href="download">downloads</a> for the latest version can
                    be found on the downloads page.
                </li>
                <li>
                    <a href="https://github.com/lucko/spark">source code</a> and
                    more information about the spark plugin is available on
                    GitHub.
                </li>
            </ul>

            <h2>Viewer</h2>
            <p>This website contains an online viewer for spark profiles.</p>
            <p>
                It is written using React, and open-source'd on GitHub. Any
                contributions are most welcome!
            </p>
            <p>
                Uploaded content is stored centrally and retained for 60 days.
            </p>
        </div>
    );
}
