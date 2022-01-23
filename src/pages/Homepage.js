import React from 'react';
import FilePicker from '../components/FilePicker';

export default function Homepage({ onFileSelected }) {
    return (
        <article className="homepage">
            <section>
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
                        <b>Server Health Reporting</b>: Keep track of overall
                        server health.
                    </li>
                </ul>
                <p>
                    More information about spark can be found on{' '}
                    <a href="https://github.com/lucko/spark">GitHub</a>, or you
                    can come chat with us on{' '}
                    <a href="https://discord.gg/PAGT2fu">Discord</a>.
                </p>
            </section>

            <section>
                <h2>Links</h2>
                <p>
                    This website contains a number of useful resources for
                    spark.
                </p>
                <ul>
                    <li>
                        <a href="https://spark.lucko.me/docs">/docs/</a> - read
                        the documentation and usage guides.
                    </li>
                    <li>
                        <a href="download">/download/</a> - grab the latest
                        version of the plugin/mod.
                    </li>
                </ul>
            </section>

            <section>
                <h2>Viewer</h2>
                <p>This website is also an online viewer for spark data.</p>
                <p>In order to use it:</p>
                <ol>
                    <li>
                        Generate a{' '}
                        <a href="https://spark.lucko.me/docs/Command-Usage#spark-profiler">
                            profile
                        </a>{' '}
                        or{' '}
                        <a href="https://spark.lucko.me/docs/Command-Usage#spark-heapsummary">
                            heap summary
                        </a>{' '}
                        using the appropriate spark commands.
                    </li>
                    <li>
                        After the data has been uploaded, spark will provide you
                        with a unique link to access the viewer.
                    </li>
                    <li>
                        Click the link to open the viewer using your web
                        browser.
                    </li>
                    <li>
                        The data will be available for ~90 days, before
                        expiring.
                    </li>
                </ol>
                <p>
                    You can also generate or export a <code>.sparkprofile</code>{' '}
                    or <code>.sparkheap</code> file directly instead of using
                    the online upload facility. To view these files, use the box
                    below.
                </p>
                <FilePicker callback={onFileSelected} />
                <p>
                    The website/viewer is written in JavaScript using the React
                    framework, and open-source'd on GitHub. Pull requests are
                    much appreciated!
                </p>
            </section>
        </article>
    );
}
