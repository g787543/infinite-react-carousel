/* eslint-disable */
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const WebpackAutoInject = require('webpack-auto-inject-version');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const config = require('../config');

const DIST = path.join(__dirname, '../dist');
const dateFormat = 'mmddhhMM';
const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);
module.exports = {
  name: 'infinite-react-carousel',
  entry: [
    'babel-polyfill',
    'resize-observer-polyfill',
    './src/index.js'
  ],
  output: {
    library: 'Carousel',
    libraryTarget: 'umd',
    path: DIST,
    filename: '[name].js'
  },
  node: {
    console: false,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return [
                  require('autoprefixer'),
                  require('cssnano')({
                    preset: [
                      'default',
                      { discardComments: { removeAll: true } }
                    ]
                  })
                ];
              }
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx']
  },
  devtool: config.dev.devtool,
  devServer: {
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    compress: true,
    open: config.dev.autoOpenBrowser,
    disableHostCheck: true,
    historyApiFallback: true,
    hot: true,
    proxy: {
      '/api': 'http://localhost:8180'
    },
  },
  optimization: {
    minimizer: [
      // we specify a custom UglifyJsPlugin here to get source maps in production
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          ecma: 6,
          mangle: true
        },
        sourceMap: true
      })
    ]
  },
  plugins: [
    new CleanWebpackPlugin([DIST]),
    new WebpackAutoInject({
      PACKAGE_JSON_PATH: './package.json',
      SHORT: 'VER',
      components: {
        AutoIncreaseVersion: true,
        InjectAsComment: true,
        InjectByTag: false
      },
      componentsOptions: {
        AutoIncreaseVersion: {
          runInWatchMode: false // it will increase version with every single build!
        },
        InjectAsComment: {
          tag: 'v{version} (build{date})',
          dateFormat
        }
      }
    }),
    new MiniCssExtractPlugin({
      chunkFilename: '[id].css',
      filename: '[name].css'
    }),
    new CompressionPlugin(),
    new BrotliPlugin()
  ]
};
