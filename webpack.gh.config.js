const path = require('path');
/* eslint-disable */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const WebpackAutoInject = require('webpack-auto-inject-version');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const portfinder = require('portfinder');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const config = require('./config');

const DIST = path.join(__dirname, './dist');
const dateFormat = 'mmddhhMM';
const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);
const devWebpackConfig = {
  name: 'infinite-react-carousel',
  entry: ['babel-polyfill', './examples/index.js'],
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
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
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
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html',
      favicon: './public/favicon.ico'
    }),
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
module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port;
      // add port to devServer config
      devWebpackConfig.devServer.port = port;

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
          ? () => {
            const notifier = require('node-notifier');
            return (severity, errors) => {
              if (severity !== 'error') return;
              const error = errors[0];
              const filename = error.file && error.file.split('!').pop()
              notifier.notify({
                title: 'infinite-react-carousel',
                message: `${severity}: ${error.name}`,
                subtitle: filename || '',
                icon: path.join(__dirname, 'logo.png')
              });
            };
          }
          : undefined
      }));

      resolve(devWebpackConfig);
    }
  });
});
