import path from 'path';
import { Configuration } from 'webpack';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';

export const fsConfig: Configuration = {
  name: 'fsConfig',
  entry: './src/backend/fs-handler/fsHandler.ts',
  dependencies: ['preloadConfig'],
  target: ['electron-preload'],
  output: {
    path: path.resolve('build'),
    filename: 'fsHandler.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.html'],
    plugins: [new TsconfigPathsPlugin({ configFile: 'src/backend/fs-handler/tsconfig.json' })],
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
