import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { SLEvent } from '../../common/constant/SLEvent';

const loadInitFsListeners = (fsWindow: BrowserWindow) => {
  console.log('Loading fs handler IPC Main listeners');

  ipcMain.on(SLEvent.GET_FS_HANDLER_CONTENTS_ID, (event) => (event.returnValue = fsWindow.webContents.id));
  ipcMain.on(SLEvent.GET_FILE_ARGUMENTS, (event) => (event.returnValue = process.argv));
};

export const createFsWindow = (isLocalDev?: boolean): BrowserWindow => {
  console.log('Creating DB browser window');
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

  console.log('Created FS browser window');

  return fsWindow;
};

export const createDevFsWindow = (): BrowserWindow => {
  const fsWindow = createFsWindow(true);

  fsWindow.webContents.openDevTools();

  return fsWindow;
};

export const loadAdditionalFiles = async (fsWindow: BrowserWindow, commandLine: string[]): Promise<void> => {
  console.log('Handling call from second process with args: ', commandLine);

  fsWindow?.webContents?.send(SLEvent.GET_ADDITIONAL_FILE_ARGUMENTS, commandLine);
};
