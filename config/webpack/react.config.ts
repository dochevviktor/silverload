import path from 'path';
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CspHtmlWebpackPlugin from 'csp-html-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';

export const reactConfig: Configuration = {
  name: 'reactConfig',
  dependencies: ['ffmpegConfig', 'databaseConfig', 'preloadConfig', 'fsConfig', 'electronConfig'],
  entry: './src/frontend/react/index.tsx',
  output: {
    path: path.resolve('build'),
    filename: 'bundle.[contenthash].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.html', '.css', '.scss'],
    plugins: [new TsconfigPathsPlugin({ configFile: 'src/frontend/react/tsconfig.json' })],
    // Use Preact compatability layer
    alias: {
      'react': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
    },
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]__[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: {
                  '@primary-color': 'silver',
                  '@body-background': '#292d33',
                  '@component-background': '@body-background',
                  '@white': '#000',
                  '@black': '@primary-color',
                  '@btn-primary-color': '@body-background',
                  '@modal-mask-bg': 'fade(@white, 45%)',
                },
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        use: ['file-loader?name=[name].[ext]'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Silverload',
      meta: {
        viewport: 'width=device-width, initial-scale=1',
        description: 'Silverload Image Browser',
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
