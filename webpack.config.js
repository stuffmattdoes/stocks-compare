// Modules
const glob = require('glob');
const path = require('path');

// Plugins
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ManifestPlugin = require('webpack-manifest-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
    devtool: 'source-map',
    entry: {
        'main': path.resolve(__dirname, 'src', 'index.js')
    },
    module: {
        rules: [
            // Resolves & bundles all Javascript dependencies (.js and .jsx)
            {
                exclude: /node_modules/,
                loader: 'babel-loader',
                test: /(\.jsx|\.js)$/,
                options: {
                    presets: [
                        'env',
                        'react',
                        'stage-2'
                    ]
                }
            },
            {
                loader: 'file',
                test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
                options: {
                    name: path.join('static', 'img', '[path][name].[ext]')
                }
            }
        ]
    },
    output: {
        // This does not produce a real file. It's just the virtual path that is
        // served by WebpackDevServer in development. This is the JS bundle
        // containing code from all our entry points, and the Webpack runtime.
        filename: path.join('static', 'js', '[name].[hash].js'),
        chunkFilename: path.join('static', 'js', '[name].[hash].js'),
        // Next line is not used in dev but WebpackDevServer crashes without it:
        path: path.resolve(__dirname, 'build'),
        // This is the URL that app is served from. We use "/" in development.
        publicPath: '/'
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: path.resolve(__dirname, 'artifacts', 'bundle-size-report.html')
        }),
        new ManifestPlugin({
            fileName: 'asset-manifest.json'
        }),
        new WebpackNotifierPlugin({
            // contentImage: path.join(__dirname, 'src', 'img', 'favicon-32x32.png'),
            excludeWarnings: true,
            alwaysNotify: false,
            sound: true
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
    }
};
