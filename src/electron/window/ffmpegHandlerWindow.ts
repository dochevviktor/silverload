import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import * as SLEvent from '../../common/class/SLEvent';
import { platform } from 'os';

const loadInitFfmpegListeners = (ffmpegWindow: BrowserWindow, isLocalDev: boolean) => {
  console.log('Loading FFMPEG handler IPC Main listeners');
  const pt = process.env.npm_config_platform || platform();

  const ffmpegExecutable = pt === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
  const ffmpegPath = isLocalDev ? `build\\${ffmpegExecutable}` : `${process.resourcesPath}\\${ffmpegExecutable}`;

  SLEvent.GET_FFMPEG_HANDLER_CONTENTS_ID.onSync(ipcMain, ffmpegWindow.webContents.id);
  SLEvent.GET_FFMPEG_EXECUTABLE_PATH.onSync(ipcMain, ffmpegPath);
};

export const createFfmpegWindow = (isLocalDev?: boolean): BrowserWindow => {
  console.log('Creating FFMPEG browser window');
  const ffmpegWindow = new BrowserWindow({
    show: isLocalDev,
    closable: false,
    title: 'FFMPEG handler window',
    webPreferences: {
      nodeIntegration: false,
      javascript: false,
      images: false,
      webgl: false,
      spellcheck: false,
      enableWebSQL: false,
      preload: path.join(__dirname, 'ffmpegHandler.js'),
    },
  });

  ffmpegWindow.loadFile(path.join(__dirname, 'ffmpegHandler.js')).catch(console.error);
  loadInitFfmpegListeners(ffmpegWindow, isLocalDev);

  console.log('Created FFMPEG browser window');

  return ffmpegWindow;
};

export const createDevFfmpegWindow = (): BrowserWindow => {
  const ffmpegWindow = createFfmpegWindow(true);

  ffmpegWindow.webContents.openDevTools();

  return ffmpegWindow;
};
