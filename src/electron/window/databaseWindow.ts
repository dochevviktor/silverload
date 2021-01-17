import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { SLDatabase } from '../../common/constant/SLDatabase';

const loadInitDbListeners = (dbWindow: BrowserWindow, dbPathIsLocalDev?: boolean) => {
  const dbPath = dbPathIsLocalDev ? 'storage.db' : `${process.resourcesPath}\\storage.db`;

  console.log('Loading db IPC Main listeners');

  ipcMain.on(SLDatabase.GET_DB_PATH, (event) => (event.returnValue = dbPath));
  ipcMain.on(SLDatabase.GET_DATABASE_HANDLER_CONTENTS_ID, (event) => (event.returnValue = dbWindow.webContents.id));
};

export const createDbWindow = (dbPathIsLocalDev?: boolean): BrowserWindow => {
  console.log('Creating DB browser window');
  const dbWindow = new BrowserWindow({
    show: dbPathIsLocalDev,
    closable: false,
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

  dbWindow.loadFile(path.join(__dirname, 'databaseHandler.js'));
  loadInitDbListeners(dbWindow, dbPathIsLocalDev);

  console.log('Created DB browser window');

  return dbWindow;
};

export const createDevDbWindow = (): BrowserWindow => {
  const dbWindow = createDbWindow(true);

  dbWindow.webContents.openDevTools();

  return dbWindow;
};
