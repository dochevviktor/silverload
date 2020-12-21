import { BrowserWindow, Menu, ipcMain } from 'electron';
import { existsSync, lstatSync, readFileSync } from 'fs';
import { lookup } from 'mime-types';
import { basename } from 'path';
import { SLFile } from '../../common/interface/SLFile';
import Database from 'better-sqlite3';
import { SLEvent } from '../../common/constant/SLEvent';
import { databaseInit } from '../database/databaseInit';
import { getSettings, saveSettings, SLSettingEvent } from '../../common/class/SLSettings';
import { deleteTabs, getTabs, saveTabs, SLTabEvent } from '../../common/class/SLTab';

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
};

const loadFrameManipulationListeners = () => {
  ipcMain.on(SLEvent.MINIMIZE_WINDOW, () => mainWindow.minimize());
  ipcMain.on(SLEvent.MAXIMIZE_WINDOW, () =>
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
  );
  ipcMain.on(SLEvent.CLOSE_WINDOW, () => mainWindow.close());
  ipcMain.on(SLEvent.GET_FILE_ARGUMENTS, (event) => (event.returnValue = getSLFilesFromArgs(process.argv)));

  mainWindow.on('maximize', () => mainWindow.webContents.send(SLEvent.WINDOW_MAXIMIZED));
  mainWindow.on('unmaximize', () => mainWindow.webContents.send(SLEvent.WINDOW_UN_MAXIMIZED));
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
      const file: SLFile = { name: name, base64: `data:${mimeType};base64,${base64}`, mimeType: mimeType, path: it };

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

const loadInitDbListeners = (dbPathIsLocalDev?: boolean) => {
  let db = null;
  const dbPath = dbPathIsLocalDev ? 'storage.db' : `${process.resourcesPath}\\storage.db`;

  try {
    db = new Database(dbPath);
    databaseInit(db);
  } catch (e) {
    console.log(e);
  }

  ipcMain.on(SLSettingEvent.LOAD_SETTINGS, (event) => (event.returnValue = getSettings(db)));
  ipcMain.on(SLSettingEvent.SAVE_SETTINGS, (event, arg) => (event.returnValue = saveSettings(db, arg)));

  ipcMain.on(SLTabEvent.LOAD_TABS, (event) => (event.returnValue = getTabs(db)));
  ipcMain.on(SLTabEvent.SAVE_TABS, (event, arg) => (event.returnValue = saveTabs(db, arg)));
  ipcMain.on(SLTabEvent.DELETE_TABS, (event) => (event.returnValue = deleteTabs(db)));
};

export const createWindow = (startUrl: string, dbPathIsLocalDev?: boolean): void => {
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
  loadInitDbListeners(dbPathIsLocalDev);
};

export const createDevWindow = (startUrl: string): void => {
  createWindow(startUrl, true);
  mainWindow.webContents.openDevTools();
};

export const handleSecondProcessCall = async (commandLine: string[]): Promise<void> => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
    mainWindow.webContents.send(SLEvent.SENT_FILE_ARGUMENTS, getSLFilesFromArgs(commandLine));
  }
};
