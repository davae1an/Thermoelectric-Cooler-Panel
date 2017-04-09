var path = require('path');
var webpack = require('webpack');

var BUILD_DIR = path.resolve(__dirname, 'client/dist');
var APP_DIR = path.resolve(__dirname, 'client');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './client/index.html',
    filename: 'index.html',
    inject: 'body'
})


module.exports = {
    entry: APP_DIR + '/index.js',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.jsx$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader'
            }, ],
        }, {
            test: /\.(jpe?g|png|gif|svg)$/i,
            use: [{
                loader: 'file-loader',
                options: {
                    query: {
                        name: 'assets/[name].[ext]'
                    }
                }
            }, {
                loader: 'image-webpack-loader',
                options: {
                    query: {
                        mozjpeg: {
                            progressive: true,
                        },
                        gifsicle: {
                            interlaced: true,
                        },
                        optipng: {
                            optimizationLevel: 7,
                        }
                    }
                }
            }]

        }]
    },
    watch: true,
    plugins: [HtmlWebpackPluginConfig]
}
