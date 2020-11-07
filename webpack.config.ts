import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import InlineChunkHtmlPlugin from 'inline-chunk-html-plugin';
import HTMLInlineCSSWebpackPlugin from 'html-inline-css-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import webpack, { EnvironmentPlugin } from 'webpack';
import express from 'express';
import merge from 'webpack-merge';
import CompressionPlugin from 'compression-webpack-plugin';
import { exec } from 'child_process';

const devConfig: webpack.Configuration = {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      DEBUG: false,
    }),
    // TODO: Remove "as any" when types are fixed
    new CompressionPlugin() as any,
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => exec('yarn run electron:run '));
      },
    },
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    hot: true,
    before(app: express.Application) {
      // Add Content-Encoding so that browser can read gzip-ed files
      app.get('*.js', (req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.url = req.url + '.gz';
        res.set('Content-Encoding', 'gzip');
        res.set('Content-Type', 'text/javascript');
        next();
      });
    },
  },
};

const prodConfig: webpack.Configuration = {
  mode: 'production',
  optimization: {
    minimize: true,
    // TODO: Remove "as any" when @types/terser-webpack-plugin stop using @types/webpack
    minimizer: [new TerserPlugin() as any],
  },
  plugins: [new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/.*/]), new HTMLInlineCSSWebpackPlugin()],
};

const commonConfig: webpack.Configuration = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.[contenthash].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.html', '.css', '.scss'],
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
              modules: true,
              importLoaders: 1,
            },
          },
          'sass-loader',
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
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
  ],
};

module.exports = (env: { production: boolean }) => {
  const envConfig = env?.production ? prodConfig : devConfig;

  return merge(commonConfig, envConfig);
};
