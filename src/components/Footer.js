import React from 'react';

export default function Footer() {
    const year = new Date().getFullYear().toString()
    return (
        <footer>
            <a href="https://github.com/lucko/spark">spark</a> and{' '}
            <a href="https://github.com/lucko/spark-viewer">spark-viewer</a> are
            free &amp; open source'd on GitHub.
            <br />
            Copyright &copy; 2018-{year}{' '}
            <a href="https://github.com/lucko">lucko</a> &amp; other spark <a href="https://spark.lucko.me/docs/misc/Credits">contributors</a>.
        </footer>
    );
}
