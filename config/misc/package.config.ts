import { Platform, build, CliOptions } from 'electron-builder';

export const packageOptions: CliOptions = {
  targets: Platform.WINDOWS.createTarget(),
  config: {
    appId: 'com.electron.silverload',
    productName: 'silverload',
    copyright: 'Copyright (c) 2020 - 2021 Viktor Dochev',
    icon: 'icon.png',
    files: ['build/**', '!node_modules'],
    asar: true,
    electronDist: 'node_modules/electron/dist',
    directories: {
      output: 'out',
    },
    win: {
      target: 'dir',
    },
    nsis: {
      license: 'LICENSE',
    },
  },
};

build(packageOptions).catch((error) => console.log(error));
