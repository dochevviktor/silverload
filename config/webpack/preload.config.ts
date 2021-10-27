import path from 'path';
import { Configuration } from 'webpack';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';

export const preloadConfig: Configuration = {
  name: 'preloadConfig',
  entry: './src/backend/preload/preload.ts',
  dependencies: ['databaseConfig'],
  target: ['electron-preload'],
  output: {
    path: path.resolve('build'),
    filename: 'preload.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.html'],
    plugins: [new TsconfigPathsPlugin({ configFile: 'src/backend/preload/tsconfig.json' })],
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },
};
