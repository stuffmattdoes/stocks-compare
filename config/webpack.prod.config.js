// Modules
const compiler = require('../webpack.config.js');
const glob = require('glob');
const merge = require('webpack-merge');
const path = require('path');

// Plugins
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(compiler, {
    module: {
        rules: [
            // Resolves & bundles all SASS dependencies (.scss syntax)
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true,
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
                })
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin([
            path.join('build'),
        ], {
            root: path.resolve(__dirname, '..')
        }),
        new CopyWebpackPlugin([
            {
                from: path.join('public', 'img'),
                to: path.join('static', 'img')
            },
            {
                from: path.join('public', 'favicon.ico'),
                to: path.join('static')
            }
        ]),
        new DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new ExtractTextPlugin({
            filename: path.join('static', 'css', '[name].[hash].css')
        }),
        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin({
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
            template: path.join('public', 'index.html')
        }),
        new UglifyJSPlugin({
            sourceMap: true
        })
    ]
});
