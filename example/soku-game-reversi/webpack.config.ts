import * as path from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
  entry: './src/index.ts',
  mode: 'production',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
  },
  target: ['web', 'es6'],
  resolve: {
    extensions: ['.ts', '.js', '.jsx', '.tsx'],
  },
  externals: ['@soku-games/core'],
  module: {
    rules: [
      {
        test: /\.(js|ts)(x)?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.ts(x)?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        // .module.sass
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          'sass-loader',
        ],
        include: /\.module\.scss$/,
      },
      {
        // .sass
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
        exclude: /\.module\.scss$/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
};

const esmConfig: Configuration = {
  ...config,
  experiments: {
    outputModule: true,
  },
  output: {
    ...config.output,
    filename: 'index.mjs',
    libraryTarget: 'module',
  },
};

const cjsConfig: Configuration = {
  ...config,
  output: {
    ...config.output,
    filename: 'index.cjs',
    libraryTarget: 'commonjs',
  },
};

export default [config, esmConfig, cjsConfig];