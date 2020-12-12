import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import InlineChunkHtmlPlugin from 'inline-chunk-html-plugin';
import HTMLInlineCSSWebpackPlugin from 'html-inline-css-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { DefinePlugin, EnvironmentPlugin, Configuration, Compiler } from 'webpack';
import { Application, Request, Response, NextFunction } from 'express';
import merge from 'webpack-merge';
import CompressionPlugin from 'compression-webpack-plugin';
import { ChildProcess, exec } from 'child_process';
import CspHtmlWebpackPlugin from 'csp-html-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

class ElectronDevPlugin {
  apply(compiler: Compiler) {
    let electronProcess: ChildProcess = null;

    compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
      if (!electronProcess) {
        electronProcess = exec('yarn run electron:run');
        electronProcess.stdout.on('data', (data) => console.log(data.toString()));
        electronProcess.stderr.on('data', (data) => console.log(data.toString()));
        electronProcess.on('exit', () => process.exit(0));
      }
    });
  }
}

const devConfig: Configuration = {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    // use 'development' unless process.env.NODE_ENV is defined
    new EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: false,
    }),
    // disable annoying react advertisement
    new DefinePlugin({
      __REACT_DEVTOOLS_GLOBAL_HOOK__: '({ isDisabled: true })',
    }),
    new CompressionPlugin(),
    // Launch electron after webpack dev server is deployed
    new ElectronDevPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    historyApiFallback: true,
    hot: true,
    before(app: Application) {
      // Add Content-Encoding so that browser can read gzip-ed files
      app.get('*.js', (req: Request, res: Response, next: NextFunction) => {
        req.url = req.url + '.gz';
        res.set('Content-Encoding', 'gzip');
        res.set('Content-Type', 'text/javascript');
        next();
      });
    },
  },
};

const prodConfig: Configuration = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  plugins: [new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/.*/]), new HTMLInlineCSSWebpackPlugin()],
};

const commonConfig: Configuration = {
  entry: './src/client/index.tsx',
  output: {
    path: path.resolve('build'),
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
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/client/index.html',
    }),
    new CspHtmlWebpackPlugin({
      'default-src': "'self'",
      'img-src': ["'self'", 'data:'],
      'object-src': "'none'",
      'base-uri': "'self'",
      'script-src': "'self'",
      'worker-src': "'self'",
      'style-src': ["'self'", "'unsafe-inline'"],
    }),
  ],
};

export default (env: { production: boolean }): Configuration => {
  const envConfig = env?.production ? prodConfig : devConfig;

  return merge(commonConfig, envConfig);
};
