import { BrowserWindow } from 'electron';
import path from 'path';
import * as SLEvent from '../../common/class/SLEvent';
import { SL_FILE_SYSTEM } from '../../common/class/SLPoint';

const loadInitFsListeners = () => {
  console.log('Loading FS Handler handler IPC Main listeners');

  SLEvent.LOAD_FILE_ARGUMENTS.onMain(() => process.argv);
  SLEvent.SEND_SL_FILES.onMain();
  SLEvent.LOAD_TAB_IMAGE.onMain();
  SLEvent.LOAD_TAB_GIF_VIDEO.onMain();
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

  SL_FILE_SYSTEM.webContents = fsWindow.webContents;
  fsWindow.loadFile(path.join(__dirname, 'fsHandler.js')).catch(console.error);
  loadInitFsListeners();

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
  SLEvent.SEND_ADDITIONAL_FILE_ARGUMENTS.sendMain(commandLine);
};
