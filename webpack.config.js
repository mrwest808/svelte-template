const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
  entry: {
    bundle: ['./src/main.js'],
  },
  resolve: {
    extensions: ['.js', '.html'],
  },
  output: {
    path: __dirname + '/build',
    filename: '[name].[hash].js',
    chunkFilename: '[name].[id].[chunkhash].js',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        exclude: [/node_modules/, __dirname + '/public'],
        use: {
          loader: 'svelte-loader',
          options: {
            skipIntroByDefault: true,
            nestedTransitions: true,
            emitCss: true,
            hotReload: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          /**
           * MiniCssExtractPlugin doesn't support HMR.
           * For developing, use 'style-loader' instead.
           * */
          prod ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  mode,
  plugins: [
    new CleanWebpackPlugin(['build'], { verbose: false }),
    new CopyWebpackPlugin([{ from: 'public' }]),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'public/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
  ],
  devtool: 'source-map',
};
