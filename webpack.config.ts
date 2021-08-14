import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import InlineChunkHtmlPlugin from 'inline-chunk-html-plugin';
import HTMLInlineCSSWebpackPlugin from 'html-inline-css-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { EnvironmentPlugin, Configuration } from 'webpack';
import { Application, Request, Response, NextFunction } from 'express';
import merge from 'webpack-merge';
import CompressionPlugin from 'compression-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { reactConfig } from './config/react.config';
import { ffmpegConfig } from './config/ffmpeg.config';
import ElectronDevPlugin from './config/class/ElectronDevPlugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

//Always attach this to the fist config for a proper cleanup on start.
const cleanOutputConfig: Configuration = {
  plugins: [new CleanWebpackPlugin()],
};

// Add this to the last config in development mode for the dev server.
const devServerConfig: Configuration = {
  plugins: [new ElectronDevPlugin()],
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    historyApiFallback: true,
    hot: true,
    before(app: Application) {
      // Add Content-Encoding so that browser can read gzip-ed files
      app.get('bundle.*.js', (req: Request, res: Response, next: NextFunction) => {
        req.url = req.url + '.gz';
        res.set('Content-Encoding', 'gzip');
        res.set('Content-Type', 'text/javascript');
        next();
      });
    },
  },
};

const devConfig: Configuration = {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    // use 'development' unless process.env.NODE_ENV is defined
    new EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: false,
    }),
    new CompressionPlugin(),
  ],
};

const prodConfig: Configuration = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  plugins: [new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/.*/]), new HTMLInlineCSSWebpackPlugin()],
  performance: {
    hints: false,
  },
};

export default (env: { production: boolean }): Configuration[] => {
  const configurations: Configuration[] = [];

  if (env?.production) {
    // because of a resolver bug with FFMPEG WASM lib, we need to use the dev environment var
    configurations.push(merge(merge(ffmpegConfig, cleanOutputConfig), devConfig));
    configurations.push(merge(reactConfig, prodConfig));
  } else {
    configurations.push(merge(merge(ffmpegConfig, cleanOutputConfig), devConfig));
    configurations.push(merge(merge(reactConfig, devServerConfig), devConfig));
  }

  return configurations;
};
