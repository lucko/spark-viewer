module.exports = {
    webpack: config => {
        config.module.rules.push({
            test: /\.svg$/,
            use: [
                {
                    loader: '@svgr/webpack',
                    options: { dimensions: false },
                },
            ],
        });

        return config;
    },
};
