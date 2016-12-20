'use strict';

let path = require('path');
let webpack = require('webpack');

module.exports = {
  resolve: {
    modules: [
      'node_modules',
      path.resolve(process.cwd(), 'src')
    ],
    extensions: ['.ts', '.js']
  },

  plugins: [
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      path.join(process.cwd(), 'src')
    )
  ],

  module: {
    loaders: [
      { test: /\.ts$/, loaders: ['awesome-typescript-loader'] }
    ]
  },

  devtool: 'inline-cheap-source-map'
};
