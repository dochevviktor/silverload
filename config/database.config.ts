import { Configuration } from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CspHtmlWebpackPlugin from 'csp-html-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import InlineChunkHtmlPlugin from 'inline-chunk-html-plugin';
import HTMLInlineCSSWebpackPlugin from 'html-inline-css-webpack-plugin';

export const databaseConfig: Configuration = {
  name: 'databaseConfig',
  entry: './src/frontend/database/databaseHandler.ts',
  output: {
    path: path.resolve('build'),
    filename: 'databaseHandler.[contenthash].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.html'],
    plugins: [new TsconfigPathsPlugin({ configFile: 'src/frontend/database/tsconfig.json' })],
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
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Database',
      filename: 'database.html',
      meta: {
        viewport: 'width=device-width, initial-scale=1',
      },
    }),
    new CspHtmlWebpackPlugin({
      'default-src': "'self'",
      'img-src': ["'self'", 'data:'],
      'media-src': ["'self'", 'data:'],
      'object-src': "'none'",
      'base-uri': "'self'",
      'script-src': "'self'",
      'script-src-elem': ["'self'", 'blob:', "'unsafe-inline'"],
      'connect-src': ["'self'", 'blob:', "'unsafe-inline'"],
      'worker-src': ["'self'", 'blob:', "'unsafe-inline'"],
      'style-src': ["'self'", "'unsafe-inline'"],
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/.*/]),
    new HTMLInlineCSSWebpackPlugin(),
  ],
};
