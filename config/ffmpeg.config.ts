import { Configuration } from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CspHtmlWebpackPlugin from 'csp-html-webpack-plugin';

export const ffmpegConfig: Configuration = {
  name: 'commonFfmpegConfig',
  entry: './src/frontend/ffmpeg/ffmpegHandler.ts',
  output: {
    path: path.resolve('build'),
    filename: 'ffmpegHandler.[contenthash].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.html'],
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
