import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from '../style/header.module.scss';
import { useContext } from 'react';
import { ThemeContext } from '../pages/_app';

export default function ThemeToggle() {
    const [theme, setTheme] = useContext(ThemeContext);
    return (
        <button
            className={styles['theme-toggle']}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={`${theme} mode`}
            aria-label={`Switch between dark and light mode (currently ${theme} mode)`}
        >
            <FontAwesomeIcon icon={theme === 'dark' ? faMoon : faSun} />
        </button>
    );
}
