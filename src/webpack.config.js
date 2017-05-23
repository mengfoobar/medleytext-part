var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var APP_DIR = path.resolve(__dirname, 'app');

var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/app/index.html',
  filename: 'index.html'
});

module.exports = {
    entry: [
        './app/index.jsx'
    ],
    output: {
        path: __dirname + '/dist',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test : /\.jsx?/,
                include : APP_DIR,
                loader : 'babel'
            },
            {
                test : /\.js?/,
                include : APP_DIR,
                loader : 'babel'
            },
            {
                test: /\.css$/,
                exclude: /bootstrap\.css$/,
                loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
            },
            {
                test: /\.png$/,
                loader: "url-loader?limit=100000"
            },
            {
                test: /\.jpg$/,
                loader: "file-loader"
            },
            {
                test   : /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
                loader : 'url-loader'
            }
        ]
    },
    externals: [
        (function () {
            var IGNORES = [
                'electron'
            ];
            return function (context, request, callback) {
                if (IGNORES.indexOf(request) >= 0) {
                    return callback(null, "require('" + request + "')");
                }
                return callback();
            };
        })()
    ],
    resolve: {
        modulesDirectories: ['app', 'node_modules']
    },
     plugins: [
         HTMLWebpackPluginConfig,
         new ExtractTextPlugin('bundle.css')
     ],
     target:"electron-renderer"
}
