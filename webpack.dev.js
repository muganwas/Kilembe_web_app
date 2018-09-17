const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');
var SRC_DIR = path.resolve(__dirname, "./src");

module.exports = merge(
    common,
    {
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: {
            contentBase: SRC_DIR + '/'
        }
    }
);