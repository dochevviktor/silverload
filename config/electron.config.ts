import { Platform, build, CliOptions } from 'electron-builder';

const options: CliOptions = {
  targets: Platform.WINDOWS.createTarget(),
  config: {
    appId: 'com.electron.silverload',
    productName: 'silverload',
    copyright: 'Copyright (c) 2020 - 2021 Viktor Dochev',
    icon: 'icon.png',
    files: [
      'build/*.js',
      '!build/bundle*',
      '!build/ffmpegHandler*',
      '!build/databaseHandler*',
      'build/*.html',
      'build/*.wasm',
      '!node_modules',
    ],
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

build(options).catch((error) => console.log(error));
