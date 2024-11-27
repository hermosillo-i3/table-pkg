const path = require('path');
const sass = require('sass');

module.exports = {
    webpack: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        configure: (webpackConfig) => {
            webpackConfig.entry = path.resolve(__dirname, 'src/playground/index.js');
            return webpackConfig;
        },
    },
    babel: {
        presets: [
            '@babel/preset-react',
            '@babel/preset-env'
        ],
    },
    style: {
        sass: {
            loaderOptions: {
                implementation: sass,
                sassOptions: {
                    silenceDeprecations: ['legacy-js-api'],
                }
            }
        },
    },
    devServer: {
        port: 3001,
    }
};