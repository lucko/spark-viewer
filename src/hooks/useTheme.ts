import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';
export type ThemeHook = [Theme, Dispatch<SetStateAction<Theme>>]

export default function useTheme(): ThemeHook {
    const [theme, setTheme] = useState<Theme>('dark');

    // load preference from local storage after mount
    useEffect(() => {
        const stored = localStorage.getItem('theme');
        if (stored !== null && (stored === 'dark' || stored === 'light')) {
            setTheme(stored);
        }
    }, []);

    // update local storage and DOM when theme changes
    useEffect(() => {
        localStorage.setItem('theme', theme);
        const root = document.documentElement;
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.setAttribute('data-theme', 'light');
        }
    }, [theme]);

    return [theme, setTheme];
}
