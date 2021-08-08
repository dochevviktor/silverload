import { BrowserWindow } from 'electron';
import path from 'path';
import * as SLEvent from '../../common/class/SLEvent';
import { SL_DATABASE } from '../../common/class/SLPoint';

const loadInitDbListeners = (dbWindow: BrowserWindow, dbPathIsLocalDev?: boolean) => {
  const dbPath = dbPathIsLocalDev ? 'storage.db' : `${process.resourcesPath}\\storage.db`;

  console.log('Loading db IPC Main listeners');

  SLEvent.GET_DB_PATH.onMain(() => dbPath);

  SLEvent.LOAD_SETTINGS.onMain();
  SLEvent.SAVE_SETTINGS.onMain();

  SLEvent.LOAD_TABS.onMain();
  SLEvent.SAVE_TABS.onMain();
  SLEvent.DELETE_TABS.onMain();
};

export const createDbWindow = (dbPathIsLocalDev?: boolean): BrowserWindow => {
  console.log('Creating DB browser window');
  const dbWindow = new BrowserWindow({
    show: dbPathIsLocalDev,
    closable: false,
    title: 'Database window',
    webPreferences: {
      nodeIntegration: false,
      javascript: false,
      images: false,
      webgl: false,
      spellcheck: false,
      enableWebSQL: false,
      preload: path.join(__dirname, 'databaseHandler.js'),
    },
  });

  SL_DATABASE.add(dbWindow.webContents);
  dbWindow.loadFile(path.join(__dirname, 'databaseHandler.js')).catch(console.error);
  loadInitDbListeners(dbWindow, dbPathIsLocalDev);

  console.log('Created DB browser window');

  return dbWindow;
};

export const createDevDbWindow = (): BrowserWindow => {
  const dbWindow = createDbWindow(true);

  dbWindow.webContents.openDevTools();

  return dbWindow;
};
