import { get as lsGet, set as lsSet } from 'local-storage';
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from 'react';

export type Toggle = [boolean, Dispatch<SetStateAction<boolean>>, () => void];

export default function useToggle(name: string, defaultValue: boolean): Toggle {
    const [value, setValue] = useState<boolean>(() => {
        const pref = lsGet(name);
        return pref !== null ? (pref as boolean) : defaultValue;
    });

    useEffect(() => {
        lsSet(name, value);
    }, [name, value]);

    const toggle = useCallback(() => {
        setValue(prev => !prev);
    }, [setValue]);

    return [value, setValue, toggle];
}
