import { BrowserWindow, Menu, ipcMain } from 'electron';
import { existsSync, lstatSync, readFileSync } from 'fs';
import { lookup } from 'mime-types';
import { basename } from 'path';
import { SLFile } from '../../common/interface/SLFile';
import Database from 'better-sqlite3';

let mainWindow = null;

const loadInitListeners = () => {
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.webContents.on('closed', () => (mainWindow = null));
  mainWindow.webContents.on('context-menu', (e, props) => mainContext(e, props));
  const db = new Database('storage.db');

  console.log(db.prepare('SELECT * FROM sqlite_master').all());
};

const loadFrameManipulationListeners = () => {
  ipcMain.on('MINIMIZE_WINDOW', () => mainWindow.minimize());
  ipcMain.on('MAXIMIZE_WINDOW', () => (mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()));
  ipcMain.on('CLOSE_WINDOW', () => mainWindow.close());
  ipcMain.on('GET_FILE_ARGUMENTS', (event) => (event.returnValue = getSLFilesFromArgs(process.argv)));

  mainWindow.on('maximize', () => mainWindow.webContents.send('WINDOW_MAXIMIZED'));
  mainWindow.on('unmaximize', () => mainWindow.webContents.send('WINDOW_MAXIMIZED'));
};

const getSLFilesFromArgs = (argList: string[]): SLFile[] => {
  const resultList = [];

  argList
    .slice(1) // first element is always the process itself - skip it
    .filter((it) => existsSync(it) && lstatSync(it).isFile())
    .forEach((it) => {
      const mimeType = lookup(it);
      const base64 = readFileSync(it, { encoding: 'base64' });
      const name = basename(it);
      const file: SLFile = { name: name, base64: `data:${mimeType};base64,${base64}`, mimeType: mimeType };

      resultList.push(file);
    });

  return resultList;
};

const mainContext = (e, props) => {
  const { x, y } = props;

  Menu.buildFromTemplate([
    {
      label: 'Reload',
      click: () => mainWindow.reload(),
    },
    {
      label: 'Inspect element',
      click: () => mainWindow.webContents.inspectElement(x, y),
    },
  ]).popup({ window: mainWindow });
};

export const createWindow = (startUrl: string): void => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minWidth: 240,
    minHeight: 70,
    frame: false,
    icon: 'icon.ico',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(startUrl);

  loadInitListeners();
  loadFrameManipulationListeners();
};

export const createDevWindow = (startUrl: string): void => {
  createWindow(startUrl);
  mainWindow.webContents.openDevTools();
};

export const handleSecondProcessCall = async (commandLine: string[]): Promise<void> => {
  console.log(commandLine);
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
    mainWindow.webContents.send('SENT_FILE_ARGUMENTS', getSLFilesFromArgs(commandLine));
  }
};
