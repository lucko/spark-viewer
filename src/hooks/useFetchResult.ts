import { useEffect, useState } from 'react';

export enum Status {
    WAITING = 'waiting',
    OK = 'ok',
    ERROR = 'error',
}

export default function useFetchResult<T>(
    url: string
): [T | undefined, Status] {
    const [status, setStatus] = useState<Status>(Status.WAITING);
    const [result, setResult] = useState<T>();

    useEffect(() => {
        if (status !== Status.WAITING) {
            return;
        }

        (async () => {
            try {
                const req = await fetch(url);
                if (!req.ok) {
                    setStatus(Status.ERROR);
                    return;
                }

                setResult(await req.json());
                setStatus(Status.OK);
            } catch (e) {
                console.log(e);
                setStatus(Status.ERROR);
            }
        })();
    }, [status, url]);

    return [result, status];
}
