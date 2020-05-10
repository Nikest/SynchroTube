const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const environment = require('./scripts/environment');

const outputDirectory = '../server/public';

module.exports = () => {
    return {
        entry: {
            app: ['babel-polyfill', './src/index.tsx'],
        },
        output: {
            path: path.join(__dirname, outputDirectory),
            filename: 'bundle.js'
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: ['node_modules']
                },
                {
                    test: /\.scss$/,
                    exclude: ['node_modules'],
                    use: [
                        'style-loader',
                        'css-loader?minimize=true&modules&importLoaders=1&localIdentName=[name]-[hash:base64:4]__[local]',
                        'resolve-url-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                data: '@import "parameters";',
                                sourceMap: true,
                                includePaths: [
                                    path.resolve(__dirname, './src/Themes/default'),
                                ],
                            }
                        }
                    ],
                },
                {
                    test: /\.(png|jpg|gif|svg)$/i,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 8192,
                            },
                        },
                    ],
                },
                {
                    test: /\.(woff(2)?|ttf|eot)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'fonts/'
                            }
                        },
                    ],
                }
            ]
        },
        resolve: {
            extensions: [ '.tsx', '.ts', '.js' ],
            modules: [
                path.resolve('./src'),
                path.resolve('./node_modules')
            ]
        },
        devServer: {
            port: 3010,
            open: true
        },
        plugins: [
            new webpack.DefinePlugin({
                CONFIG: JSON.stringify(environment)
            }),
            new HtmlWebpackPlugin({
                template: './src/index.ejs'
            }),
            new UglifyJsPlugin({
                uglifyOptions: {
                    warnings: false,
                    parse: {},
                    compress: {},
                    mangle: true,
                    output: null,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_fnames: false,
                }
            })
        ]
    };
};
