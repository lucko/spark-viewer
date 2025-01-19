/** @type {import('next').NextConfig} */
module.exports = {
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
