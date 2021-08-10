import { app, ipcMain } from 'electron';
import createWindow from './window/mainWindow';
import createDbWindow from './window/databaseWindow';
import createFsWindow from './window/fsHandlerWindow';
import * as SLEvent from '../common/class/SLEvent';

const createMainWindow = async () => {
  await createDbWindow().load();
  await createFsWindow().load();
  const mainWindow = createWindow();

  await mainWindow.load();
  mainWindow.browserWindow.show();

  SLEvent.CLOSE_WINDOW.onMain(closeAllWindows);
};

const closeAllWindows = () => {
  console.log('Closing all windows');
  app.quit();
  app.exit(0);
};

const bootstrap = () => {
  global.ipcMain = ipcMain;
  // If a second instance is started - we close it
  if (!app.requestSingleInstanceLock()) {
    app.quit();
  }

  // Create the main window on start
  app.on('ready', createMainWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', app.quit);
};

bootstrap();
