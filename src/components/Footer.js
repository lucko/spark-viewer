import React from 'react';

export default function Footer() {
    const year = new Date().getFullYear().toString()
    return (
        <footer>
            <a href="https://github.com/lucko/spark">spark</a> and{' '}
            <a href="https://github.com/lucko/spark-viewer">spark-viewer</a> are
            based on WarmRoast by sk89q.
            <br />
            Copyright &copy; 2018-{year}{' '}
            <a href="https://github.com/lucko">lucko</a>,{' '}
            <a href="https://github.com/astei">astei</a> & spark contributors
        </footer>
    );
}
