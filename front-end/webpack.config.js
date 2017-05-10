var path = require('path');
var webpack = require('webpack');

var BUILD_DIR = path.resolve(__dirname, 'client/dist');
var APP_DIR = path.resolve(__dirname, 'client');
const imgPath = path.join(__dirname, './client/assets');

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
                test: /\.(png|gif|jpg|svg)$/,
                include: imgPath,
                use: 'url-loader?limit=20480&name=assets/[name]-[hash].[ext]',
            }


        ]
    },
    watch: true,
    plugins: [HtmlWebpackPluginConfig]
}

