const path = require('path');
const { isDevelopment } = require('./gulp_tasks/config');
const webpack = require('webpack');

const ifDevelopment = (a, b) => (isDevelopment ? a : b);
const ifProduction = (a, b) => ifDevelopment(b, a);

module.exports = {
  output: {
    filename: 'main.js',
    path: path.resolve(process.cwd(), 'public'),
  },
  watch: isDevelopment,
  devtool: isDevelopment ? 'cheap-module-inline-source-map' : null,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['latest'] },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    ifProduction(new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
        unused: false,
      },
    })),
  ],
};
