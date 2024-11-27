const path = require('path');

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
    devServer: {
        port: 3001,
    }
};