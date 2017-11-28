import path from 'path';
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import DashboardPlugin from 'webpack-dashboard/plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MinifyPlugin from 'babel-minify-webpack-plugin';
import WebpackNotifierPlugin from 'webpack-notifier';

// App path configuration
const appPath = {
  content: path.resolve(__dirname, './src/content/'),
  popup: path.resolve(__dirname, './src/popup/'),
  popupTemplate: path.resolve(__dirname, './public/popup.html'),
  build: path.resolve(__dirname, './build'),
  source: path.resolve(__dirname, './src'),
  manifest: path.resolve(__dirname, './public/manifest.json'),
  imageAssets: path.resolve(__dirname, './src/assets/images/')
};

// Create popup.html inject script bundles
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  inject: true,
  chunks: ['popup'],
  filename: 'popup.html',
  template: appPath.popupTemplate
});

// Copy extension manifest, style and icons
const copyWebpackPluginConfig = new CopyWebpackPlugin([
  {
    from: appPath.manifest
  },
  {
    from: appPath.popupTemplate
  },
  {
    from: appPath.imageAssets
  }
]);

// Notifier plugin config
const notifierPluginConfig = new WebpackNotifierPlugin({
  title: 'React Chrome Extension Boilerplate',
  message: '🔥'
});

// Loader Options plugin config
const loaderOptionsPluginConfig = new webpack.LoaderOptionsPlugin({
  minimize: true,
  debug: false
});

// Define plugin config
const definePluginConfig = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production')
  }
});

// Webpack configuration
const config = {
  // Entry files for content page
  entry: {
    content: appPath.content,
    popup: appPath.popup
  },
  // Extension will be built into ./build folder, which we can then load as unpacked extension in Chrome
  output: {
    path: appPath.build,
    filename: '[name].js'
  },
  // Loader definitions
  module: {
    rules: [
      // Babel to transpile JSX
      {
        test: /\.js$/,
        include: [appPath.source],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // File loader
      {
        test: /\.(eot|otf|ttf|woff|woff2)(\?.*)?$/,
        exclude: /node_modules/,
        loader: 'file-loader?limit=100000'
      },
      {
        test: /\.(ico|webp|jpe?g|png|gif|svg)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              emitFile: false,
              name: '[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    HTMLWebpackPluginConfig,
    loaderOptionsPluginConfig,
    definePluginConfig,
    new MinifyPlugin(),
    copyWebpackPluginConfig,
    new DashboardPlugin(),
    notifierPluginConfig
  ],
  devtool: 'cheap-module-source-map'
};

export default config;
