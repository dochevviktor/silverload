import { app, ipcMain } from 'electron';
import createReactWindow from './window/reactWindow';
import createDbWindow from './window/databaseWindow';
import createFsWindow from './window/fsHandlerWindow';
import createFfmpegWindow from './window/ffmpegWindow';

const loadAllWindows = async () => {
  await createDbWindow().load();
  await createFsWindow().load();
  await createFfmpegWindow().load();
  await createFfmpegWindow(false).load();
  await createFfmpegWindow(false).load();
  const reactWindow = createReactWindow();

  await reactWindow.load();
  reactWindow.browserWindow.show();
};

const bootstrap = () => {
  global.ipcMain = ipcMain;
  // If a second instance is started - we close it
  if (!app.requestSingleInstanceLock()) {
    app.quit();
  }

  // Create load all windows on start
  app.on('ready', loadAllWindows);

  // Quit when all windows are closed.
  app.on('window-all-closed', app.quit);
};

bootstrap();
