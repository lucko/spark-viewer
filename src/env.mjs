// @ts-check

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const stringOrUndefined = (/** @type {unknown} */ e) => {
    if (typeof e !== 'string') return undefined;

    return e.trim() === '' ? undefined : e;
};

export const env = createEnv({
    server: {
        DOCS_URL: z.preprocess(
            stringOrUndefined,
            z.string().url().default('https://spark-docs.vercel.app')
        ),
        THUMBNAIL_SERVICE_URL: z.preprocess(
            stringOrUndefined,
            z.string().url().default('https://spark-thumbnail-service.lucko.me')
        ),
        JSON_SERVICE_URL: z.preprocess(
            stringOrUndefined,
            z.string().url().default('https://spark-json-service.lucko.me')
        ),
    },
    client: {
        NEXT_PUBLIC_BASE_URL: z.preprocess(
            stringOrUndefined,
            z.string().url().default('https://spark.lucko.me')
        ),
        NEXT_PUBLIC_SENTRY_DSN: z.preprocess(
            stringOrUndefined,
            z.string().url().optional()
        ),
        NEXT_PUBLIC_BYTEBIN_URL: z.preprocess(
            stringOrUndefined,
            z.string().url().default('https://spark-usercontent.lucko.me')
        ),
        NEXT_PUBLIC_MAPPINGS_URL: z.preprocess(
            stringOrUndefined,
            z.string().url().default('https://sparkmappings.lucko.me')
        ),
        NEXT_PUBLIC_API_URL: z.preprocess(
            stringOrUndefined,
            z.string().url().default('https://sparkapi.lucko.me')
        ),
        NEXT_PUBLIC_WEBSOCKETS_URL: z.preprocess(
            stringOrUndefined,
            z.string().url().default('wss://spark-usersockets.lucko.me')
        ),
    },
    // Next.js only bundles "actually used" env vars, so we need to
    // explicitly tell it to bundle the env vars, so they are included
    // in the bundle.
    runtimeEnv: {
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
        NEXT_PUBLIC_BYTEBIN_URL: process.env.NEXT_PUBLIC_BYTEBIN_URL,
        NEXT_PUBLIC_MAPPINGS_URL: process.env.NEXT_PUBLIC_MAPPINGS_URL,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_WEBSOCKETS_URL: process.env.NEXT_PUBLIC_WEBSOCKETS_URL,

        DOCS_URL: process.env.DOCS_URL,
        THUMBNAIL_SERVICE_URL: process.env.THUMBNAIL_SERVICE_URL,
        JSON_SERVICE_URL: process.env.JSON_SERVICE_URL,
    },
});
