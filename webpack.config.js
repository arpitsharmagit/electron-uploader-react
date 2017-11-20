const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  externals: nodeModules,
  target: 'electron-renderer',
  entry: [
    './src/app/index.js'
  ],
  output: {
    path: __dirname + "/src/public/js",
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })],
  module: {
    loaders: [
       {
         test: /\.js$/,
         loader: "eslint-loader",
         enforce: 'pre',
         query: {
           presets: ['react', 'es2015', 'stage-1']
         },
         exclude: /(node_modules|public|server)/
       },
      {
        exclude: /(node_modules|public|test)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-1']
        }
      },
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    port: 4172,
    overlay: {
        errors: true,
        warnings: true
      }
  }
};
