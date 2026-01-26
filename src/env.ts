import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const stringOrUndefined = (e: unknown) => {
    if (typeof e !== 'string') return undefined;
    return e.trim() === '' ? undefined : e;
};

export const env = createEnv({
    server: {
        SPARK_DOCS_URL: z.preprocess(
            stringOrUndefined,
            z.string().url().default('https://spark-docs.vercel.app')
        ),
        SPARK_THUMBNAIL_SERVICE_URL: z.preprocess(
            stringOrUndefined,
            z.string().url().default('https://spark-thumbnail-service.lucko.me')
        ),
        SPARK_JSON_SERVICE_URL: z.preprocess(
            stringOrUndefined,
            z.string().url().default('https://spark-json-service.lucko.me')
        ),
    },
    client: {
        NEXT_PUBLIC_SPARK_BASE_URL: z.preprocess(
            stringOrUndefined,
            z.string().url().default('https://spark.lucko.me')
        ),
        NEXT_PUBLIC_SPARK_BYTEBIN_URL: z.preprocess(
            stringOrUndefined,
            z.string().url().default('https://spark-usercontent.lucko.me')
        ),
        NEXT_PUBLIC_SPARK_BYTESOCKS_URL: z.preprocess(
            stringOrUndefined,
            z.string().url().default('wss://spark-usersockets.lucko.me')
        ),
        NEXT_PUBLIC_SPARK_MAPPINGS_URL: z.preprocess(
            stringOrUndefined,
            z.string().url().default('https://spark-mappings.lucko.me')
        ),
        NEXT_PUBLIC_SPARK_API_URL: z.preprocess(
            stringOrUndefined,
            z.string().url().default('https://sparkapi.lucko.me')
        ),
        NEXT_PUBLIC_SPARK_MONITOR_URL: z.preprocess(
            stringOrUndefined,
            z.string().url().default('https://as-spark-monitor.arminosi.workers.dev')
        ),
    },
    runtimeEnv: {
        SPARK_DOCS_URL: process.env.SPARK_DOCS_URL,
        SPARK_THUMBNAIL_SERVICE_URL: process.env.SPARK_THUMBNAIL_SERVICE_URL,
        SPARK_JSON_SERVICE_URL: process.env.SPARK_JSON_SERVICE_URL,
        NEXT_PUBLIC_SPARK_BASE_URL: process.env.NEXT_PUBLIC_SPARK_BASE_URL,
        NEXT_PUBLIC_SPARK_BYTEBIN_URL:
            process.env.NEXT_PUBLIC_SPARK_BYTEBIN_URL,
        NEXT_PUBLIC_SPARK_BYTESOCKS_URL:
            process.env.NEXT_PUBLIC_SPARK_BYTESOCKS_URL,
        NEXT_PUBLIC_SPARK_MAPPINGS_URL:
            process.env.NEXT_PUBLIC_SPARK_MAPPINGS_URL,
        NEXT_PUBLIC_SPARK_API_URL: process.env.NEXT_PUBLIC_SPARK_API_URL,
        NEXT_PUBLIC_SPARK_MONITOR_URL: process.env.NEXT_PUBLIC_SPARK_MONITOR_URL,
    },
});
