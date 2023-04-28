const { withSentryConfig } = require('@sentry/nextjs');
const fs = require('fs');

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    webpack: config => {
        config.module.rules.push({
            test: /\.svg$/,
            use: [{ loader: '@svgr/webpack', options: { dimensions: false } }],
        });
        return config;
    },
    rewrites: async () => [
        {
            source: '/docs/:path*',
            destination: 'https://spark-docs.vercel.app/:path*',
        },
        {
            source: '/thumb/:slug',
            destination: 'https://spark-thumbnail-service.lucko.me/:slug',
        },
        {
            source: '/:slug',
            has: [{ type: 'query', key: 'raw' }],
            destination: 'https://spark-json-service.lucko.me/:slug',
        },
    ],
};

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.log('Configuring Sentry...')

    // dynamically create sentry config
    for (const path of [
        'sentry.client.config.ts',
        'sentry.edge.config.ts',
        'sentry.server.config.ts',
    ]) {
        fs.writeFileSync(
            path,
            `import * as Sentry from "@sentry/nextjs"; Sentry.init({ dsn: '${process.env.NEXT_PUBLIC_SENTRY_DSN}' }); `
        );
    }

    module.exports = withSentryConfig(
        nextConfig,
        { silent: false },
        {
            // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
            tunnelRoute: '/monitoring',
            hideSourceMaps: true,
            autoInstrumentServerFunctions: false,
            autoInstrumentMiddleware: false,
        }
    );
} else {
    module.exports = nextConfig;
}
