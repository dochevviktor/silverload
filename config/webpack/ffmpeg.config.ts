import path from 'path';
import { Configuration } from 'webpack';
// eslint-disable-next-line import/default
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CspHtmlWebpackPlugin from 'csp-html-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import ReplaceInFileWebpackPlugin from 'replace-in-file-webpack-plugin';
import merge from 'webpack-merge';

export const ffmpegConfig: Configuration = {
  name: 'ffmpegConfig',
  entry: './src/frontend/ffmpeg/ffmpegHandler.ts',
  output: {
    path: path.resolve('build'),
    filename: 'ffmpegHandler.[contenthash].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.html'],
    plugins: [new TsconfigPathsPlugin({ configFile: 'src/frontend/ffmpeg/tsconfig.json' })],
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
    new CopyPlugin({
      patterns: [
        {
          from: '**/@ffmpeg/core/dist/esm/*',
          to: '[name][ext]',
        },
      ],
    }),
    new HtmlWebpackPlugin({
      title: 'FFMPEG',
      filename: 'ffmpeg.html',
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
  ],
};

export const ffmpegConfigProd: Configuration = merge(ffmpegConfig, {
  plugins: [
    new ReplaceInFileWebpackPlugin([
      {
        dir: 'build',
        test: [/ffmpegHandler.*\.js$/, /ffmpeg\.html$/],
        rules: [
          {
            search: 'https://unpkg.com/@ffmpeg/core@',
            replace: '',
          },
          {
            search: '].substring',
            replace: ']?.substring',
          },
          {
            search: '/dist',
            replace: '.',
          },
        ],
      },
    ]),
  ],
});
