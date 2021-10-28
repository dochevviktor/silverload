import { build, CliOptions } from 'electron-builder';
import merge from 'webpack-merge';
import { packageOptions } from './package.config';

export const publishOptions: CliOptions = merge(packageOptions, {
  config: {
    win: {
      target: ['zip', 'squirrel'],
    },
    squirrelWindows: {
      iconUrl: 'https://raw.githubusercontent.com/dochevviktor/silverload/master/icon.png',
    },
  },
});

build(publishOptions).catch((error) => console.log(error));
