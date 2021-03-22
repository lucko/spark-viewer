import React from 'react';

export default function Homepage() {
    return (
        <div className="page">
            <h1># spark</h1>
            <p>spark is a performance profiling plugin/mod for Minecraft clients, servers and proxies.</p>
            <p>spark is made up of three separate components:</p>
            <ul>
                <li><b>CPU Profiler</b>: Diagnose performance issues with your server.</li>
                <li><b>Memory Inspection</b>: Diagnose memory issues with your server.</li>
                <li><b>Server Health Reporting</b>: Keep track of your servers overall health.</li>
            </ul>
            <p>You can find <a href="https://spark.lucko.me/docs">documentation</a> for spark on our docs website.</p>
            <p>You can <a href="download">download</a> the latest version from the downloads page.</p>
            <p>The source code and more information about the spark plugin is available on <a href="https://github.com/lucko/spark">GitHub</a>.</p>

            <h2># Viewer</h2>
            <p>This website contains an online viewer for spark profiles.</p>
            <p>It is written using React, and open-source'd on GitHub. Any contributions are most welcome!</p>
            <p>Uploaded content is stored centrally and retained for 60 days.</p>
        </div>
    );
}
