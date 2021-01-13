import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import url from 'url';
import { createDevWindow, createWindow, handleSecondProcessCall } from './window/mainWindow';
import { createDevDbWindow, createDbWindow } from './window/databaseWindow';
import { SLEvent } from '../common/constant/SLEvent';

let mainWindow: BrowserWindow = null;
let dbWindow: BrowserWindow = null;

const createMainWindow = () => {
  let startURL = process.env.ELECTRON_START_URL;

  if (startURL) {
    mainWindow = createDevWindow(startURL);
    dbWindow = createDevDbWindow(startURL);
  } else {
    startURL = url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    });

    mainWindow = createWindow(startURL);
    dbWindow = createDbWindow(startURL);
  }

  ipcMain.on(SLEvent.CLOSE_WINDOW, closeAllWindows);
};

const closeAllWindows = () => {
  dbWindow.close();
  mainWindow.close();
};

const bootstrap = () => {
  // If a second instance is started - we close it
  if (!app.requestSingleInstanceLock()) {
    app.quit();
  }

  // Create the main window on start
  app.on('ready', createMainWindow);

  // Handle multiple instances
  app.on('second-instance', (event, commandLine) => handleSecondProcessCall(mainWindow, commandLine));

  // Quit when all windows are closed.
  app.on('window-all-closed', app.quit);
};

bootstrap();
