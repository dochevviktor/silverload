import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import * as SLEvent from '../../common/class/SLEvent';

const loadInitFsListeners = (fsWindow: BrowserWindow) => {
  console.log('Loading FS Handler handler IPC Main listeners');

  SLEvent.GET_FS_HANDLER_CONTENTS_ID.onSync(ipcMain, fsWindow.webContents.id);
  SLEvent.GET_FILE_ARGUMENTS.onSync(ipcMain, process.argv);
};

export const createFsWindow = (isLocalDev?: boolean): BrowserWindow => {
  console.log('Creating FS Handler browser window');
  const fsWindow = new BrowserWindow({
    show: isLocalDev,
    closable: false,
    title: 'File System handler window',
    webPreferences: {
      nodeIntegration: false,
      javascript: false,
      images: false,
      webgl: false,
      spellcheck: false,
      enableWebSQL: false,
      preload: path.join(__dirname, 'fsHandler.js'),
    },
  });

  fsWindow.loadFile(path.join(__dirname, 'fsHandler.js')).catch(console.error);
  loadInitFsListeners(fsWindow);

  console.log('Created FS Handler browser window');

  return fsWindow;
};

export const createDevFsWindow = (): BrowserWindow => {
  const fsWindow = createFsWindow(true);

  fsWindow.webContents.openDevTools();

  return fsWindow;
};

export const loadAdditionalFiles = async (fsWindow: BrowserWindow, commandLine: string[]): Promise<void> => {
  console.log('Handling call from second process with args: ', commandLine);
  SLEvent.GET_ADDITIONAL_FILE_ARGUMENTS.send(fsWindow.webContents, commandLine);
};
