import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import useToggle from '../../common/hooks/useToggle';

export interface InfoPointData {
    description: string;
    methods: string[];
    threads: string[];
}

export interface InfoPointsData {
    points: InfoPointData[];
}

async function fetchData(): Promise<InfoPointsData> {
    const resp = await fetch('https://spark-infopoints.lucko.me/points.json');
    return await resp.json();
}

export interface InfoPointsHook {
    enabled: boolean;
    setEnabled: Dispatch<SetStateAction<boolean>>;
    toggleEnabled: () => void;

    methods?: InfoPointsLookup;
    threads?: InfoPointsLookup;
}

export default function useInfoPoints(): InfoPointsHook {
    const [enabled, setEnabled, toggleEnabled] = useToggle(
        'prefInfoPoints',
        true
    );

    const [methods, setMethods] = useState<InfoPointsLookup>();
    const [threads, setThreads] = useState<InfoPointsLookup>();
    useEffect(() => {
        fetchData().then(data => {
            setMethods(new InfoPointsLookup(data, data => data.methods));
            setThreads(new InfoPointsLookup(data, data => data.threads));
        });
    }, []);
    return { methods, threads, enabled, setEnabled, toggleEnabled };
}

export interface LookupResult {
    result?: string;
}

export class InfoPointsLookup {
    private static readonly EMPTY_RESULT: LookupResult = {};
    private static readonly REGEX_KEY: RegExp = /\/(.+)\//;

    private readonly map = new Map<string, LookupResult>();
    private readonly regexMap = new Map<RegExp, string>();

    constructor(
        data: InfoPointsData,
        keysFunc: (data: InfoPointData) => string[]
    ) {
        for (const entry of data.points) {
            for (const key of keysFunc(entry)) {
                const match = InfoPointsLookup.REGEX_KEY.exec(key);
                if (match) {
                    const regex = new RegExp(match[1]);
                    this.regexMap.set(regex, entry.description);
                } else {
                    this.map.set(key, { result: entry.description });
                }
            }
        }
    }

    lookup(key: string): LookupResult {
        const result = this.map.get(key);
        if (result) {
            return result;
        }

        for (const [regex, description] of this.regexMap) {
            if (regex.test(key)) {
                const matchedResult: LookupResult = { result: description };
                this.map.set(key, matchedResult);
                return matchedResult;
            }
        }

        this.map.set(key, InfoPointsLookup.EMPTY_RESULT);
        return InfoPointsLookup.EMPTY_RESULT;
    }
}
