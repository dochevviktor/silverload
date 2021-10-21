import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import InlineChunkHtmlPlugin from 'inline-chunk-html-plugin';
import HTMLInlineCSSWebpackPlugin from 'html-inline-css-webpack-plugin';
import HtmlMinimizerPlugin from 'html-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { EnvironmentPlugin, Configuration } from 'webpack';
import merge from 'webpack-merge';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { reactConfig } from './config/react.config';
import { ffmpegConfig } from './config/ffmpeg.config';
import ElectronDevPlugin from './config/class/ElectronDevPlugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { databaseConfig } from './config/database.config';

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
    // Needed for SharedArrayBuffer used by FFMPEG
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
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
  ],
};

const prodConfig: Configuration = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin(), new HtmlMinimizerPlugin()],
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
    configurations.push(merge(databaseConfig, prodConfig));
    configurations.push(merge(reactConfig, prodConfig));
  } else {
    configurations.push(merge(merge(ffmpegConfig, cleanOutputConfig), devConfig));
    configurations.push(merge(databaseConfig, devConfig));
    configurations.push(merge(merge(reactConfig, devServerConfig), devConfig));
  }

  return configurations;
};
