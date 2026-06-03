import { RefObject, useEffect, useState } from 'react';

/**
 * Observes the width of a container element using ResizeObserver.
 * Returns `undefined` on the first render (before measurement).
 */
export default function useContainerWidth(
    ref: RefObject<HTMLElement | null>
): number | undefined {
    const [width, setWidth] = useState<number | undefined>(undefined);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new ResizeObserver(([entry]) => {
            setWidth(entry.contentRect.width);
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, [ref]);

    return width;
}
