const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        modules: [resolve("./node_modules")],
    },
    mode: 'production',
    context: resolve(__dirname),
    devtool: 'source-map',
    entry: './src/main.tsx',
    output: {
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ["ts-loader"],
                exclude: /node_modules/,
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
        ],
    },
    plugins: [
        new NodePolyfillPlugin(),
        new HtmlWebpackPlugin({ template: "./index.html" }),
    ],
    devServer: {
        hot: true,
        historyApiFallback: true,
    },
    performance: {
        hints: false,
    },
};
