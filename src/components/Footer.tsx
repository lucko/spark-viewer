import styles from '../style/footer.module.scss';

export default function Footer() {
    const year = new Date().getFullYear().toString();
    return (
        <footer className={styles.footer}>
            <div className={styles['footer-content']}>
                <div className={styles['footer-branding']}>
                    <div className={styles['playcdu-info']}>
                        <span className={styles['brand-name']}>PlayCDU</span>
                        <span className={styles['separator']}>|</span>
                        <span className={styles['server-name']}>Craft Down Under</span>
                    </div>
                    <div className={styles['server-links']}>
                        <a href="https://craftdownunder.co" className={styles['link']}>Website</a>
                        <span className={styles['dot']}>•</span>
                        <a href="https://discord.gg/playcdu" className={styles['link']}>Discord</a>
                    </div>
                </div>
                <div className={styles['footer-credits']}>
                    <div className={styles['spark-info']}>
                        <a href="https://github.com/lucko/spark">spark</a> and{' '}
                        <a href="https://github.com/lucko/spark-viewer">spark-viewer</a> by{' '}
                        <a href="https://github.com/lucko">lucko</a>
                    </div>
                    <div className={styles['copyright']}>
                        &copy; 2018-{year} spark contributors • PlayCDU fork maintained with 💜
                    </div>
                </div>
            </div>
        </footer>
    );
}
