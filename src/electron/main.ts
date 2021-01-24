import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import url from 'url';
import { createDevWindow, createWindow, restoreMainWindow } from './window/mainWindow';
import { createDevDbWindow, createDbWindow } from './window/databaseWindow';
import * as SLEvent from '../common/class/SLEvent';
import { createDevFsWindow, createFsWindow, loadAdditionalFiles } from './window/fsHandlerWindow';

let mainWindow: BrowserWindow = null;
let fsHandlerWindow: BrowserWindow = null;

const createMainWindow = () => {
  let startURL = process.env.ELECTRON_START_URL;

  if (startURL) {
    console.log('Starting in DEV mode');
    createDevDbWindow().webContents.on('did-finish-load', () => {
      fsHandlerWindow = createDevFsWindow();
      fsHandlerWindow.webContents.on('did-finish-load', () => {
        mainWindow = createDevWindow(startURL);
      });
    });
  } else {
    startURL = url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    });
    console.log('Starting in PROD mode');
    createDbWindow().webContents.on('did-finish-load', () => {
      fsHandlerWindow = createFsWindow();
      fsHandlerWindow.webContents.on('did-finish-load', () => {
        mainWindow = createWindow(startURL);
      });
    });
  }

  SLEvent.CLOSE_WINDOW.on(ipcMain, closeAllWindows);
};

const closeAllWindows = () => {
  console.log('Closing all windows');
  app.quit();
  app.exit(0);
};

const bootstrap = () => {
  // If a second instance is started - we close it
  if (!app.requestSingleInstanceLock()) {
    app.quit();
  }

  // Create the main window on start
  app.on('ready', createMainWindow);

  // Handle multiple instances
  app.on('second-instance', () => restoreMainWindow(mainWindow));
  app.on('second-instance', (event, commandLine) => loadAdditionalFiles(fsHandlerWindow, commandLine));

  // Quit when all windows are closed.
  app.on('window-all-closed', app.quit);
};

bootstrap();
