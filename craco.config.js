const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        configure: (webpackConfig) => {
            webpackConfig.entry = path.resolve(__dirname, 'src/playground/index.js');
            const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf);
            if (oneOfRule) {
                const sassRule = oneOfRule.oneOf.find((rule) => rule.test && rule.test.toString().includes('scss'));
                if (sassRule) {
                    sassRule.use = [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                implementation: require('sass'),
                                api: "modern",
                                sassOptions: {
                                    fiber: false,
                                },
                            },
                        }
                    ];
                }
            }
            return webpackConfig;
        },
    },
    babel: {
        presets: [
            '@babel/preset-react',
            '@babel/preset-env'
        ],
    },
    devServer: {
        port: 3001,
    }
};