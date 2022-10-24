import { Context, useContext } from 'react';

export default function useContextWithOverride<T>(
    context: Context<T>,
    override?: T
) {
    const res = useContext(context);
    if (override) {
        return override;
    } else {
        return res;
    }
}
