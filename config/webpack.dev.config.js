// Modules
const compiler = require('../webpack.config.js');
const glob = require('glob');
const merge = require('webpack-merge');
const path = require('path');

// Plugins
const DefinePlugin = require('webpack').DefinePlugin;
const HotModuleReplacementPlugin = require('webpack').HotModuleReplacementPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NamedModulesPlugin = require('webpack').NamedModulesPlugin;

module.exports = merge(compiler, {
    devServer: {
        // boolean | string | array, static file location
        contentBase: 'build',
        // serve index.html at any URL
        historyApiFallback: true,
        // Hot module reloading, enables automatic browser refreshing on code changes
        hot: true,
        // Open a new web browser page on server initialization
        open: true,
        publicPath: compiler.output.publicPath
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: path.resolve(__dirname, 'config', 'postcss.config.js')
                            },
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            // includePaths: glob.sync('node_modules').map((d) => path.join(__dirname, d)),
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.join('public', 'index.html')
        })
    ]
});
