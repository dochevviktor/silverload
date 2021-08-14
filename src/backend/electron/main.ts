import { app, ipcMain } from 'electron';
import createWindow from './window/mainWindow';
import createDbWindow from './window/databaseWindow';
import createFsWindow from './window/fsHandlerWindow';
import createFfmpegWindow from './window/ffmpegWindow';

const createMainWindow = async () => {
  await createDbWindow().load();
  await createFsWindow().load();
  await createFfmpegWindow().load();
  await createFfmpegWindow(false).load();
  await createFfmpegWindow(false).load();
  const mainWindow = createWindow();

  await mainWindow.load();
  mainWindow.browserWindow.show();
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
