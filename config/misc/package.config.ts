import { platform } from 'os';
import { Platform, build, CliOptions } from 'electron-builder';

let target;

if (platform() == 'win32') {
  target = Platform.WINDOWS.createTarget();
} else if (platform() == 'linux') {
  target = Platform.LINUX.createTarget();
}

export const packageOptions: CliOptions = {
  targets: target,
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
      target: ['dir'],
    },
    linux: {
      icon: 'icon.icns',
      target: ['pacman'],
      maintainer: 'Viktor Dochev <dochevviktor@gmail.com>',
      category: 'Graphics',
    },
  },
};

build(packageOptions).catch((error) => console.log(error));
