import styles from '../style/footer.module.scss';

export default function Footer() {
    const year = new Date().getFullYear().toString();
    return (
        <footer className={styles.footer}>
            <a href="https://github.com/lucko/spark">spark</a> and{' '}
            <a href="https://github.com/lucko/spark-viewer">spark-viewer</a> are
            free &amp; open source on GitHub.
            <br />
            Copyright &copy; 2018-{year}{' '}
            <a href="https://github.com/lucko">lucko</a> &amp; other spark{' '}
            <a href="docs/misc/Credits">contributors</a>.
        </footer>
    );
}
