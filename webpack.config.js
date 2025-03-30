const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin'); // Add this line

module.exports = {
  entry: {
    index: './src/index.js',
    register: './src/register.js',
    login: './src/login.js',
  },
  output: {
    filename: '[name]_bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src', 'Image Grid'), to: 'images' },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      template: './src/register.html',
      filename: 'register.html',
      chunks: ['register'],
    }),
    new HtmlWebpackPlugin({
      template: './src/login.html',
      filename: 'login.html',
      chunks: ['login'],
    }),
  ],
  resolveLoader: {
    modules: ['node_modules']
  },
};