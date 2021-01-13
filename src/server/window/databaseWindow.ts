import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { SLDatabase } from '../../common/constant/SLDatabase';

const loadInitDbListeners = (dbWindow: BrowserWindow, dbPathIsLocalDev?: boolean) => {
  const dbPath = dbPathIsLocalDev ? 'storage.db' : `${process.resourcesPath}\\storage.db`;

  ipcMain.on(SLDatabase.GET_DB_PATH, (event) => (event.returnValue = dbPath));
  ipcMain.on(SLDatabase.GET_DATABASE_HANDLER_CONTENTS_ID, (event) => (event.returnValue = dbWindow.webContents.id));
};

export const createDbWindow = (dbPathIsLocalDev?: boolean): BrowserWindow => {
  const dbWindow = new BrowserWindow({
    show: dbPathIsLocalDev,
    webPreferences: {
      preload: path.join(__dirname, 'databaseHandler.js'),
    },
  });

  dbWindow.loadFile(path.join(__dirname, 'databaseHandler.js'));
  loadInitDbListeners(dbWindow, dbPathIsLocalDev);

  return dbWindow;
};

export const createDevDbWindow = (): BrowserWindow => {
  const dbWindow = createDbWindow(true);

  dbWindow.webContents.openDevTools();

  return dbWindow;
};
