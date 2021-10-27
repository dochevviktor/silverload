import path from 'path';
import { Configuration } from 'webpack';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';

export const electronConfig: Configuration = {
  name: 'electronConfig',
  entry: './src/backend/electron/main.ts',
  dependencies: ['preloadConfig', 'fsConfig'],
  target: ['electron-main'],
  output: {
    path: path.resolve('build'),
    filename: 'main.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.html'],
    plugins: [new TsconfigPathsPlugin({ configFile: 'src/backend/electron/tsconfig.json' })],
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
