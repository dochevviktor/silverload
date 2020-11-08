import { app } from 'electron';
import path from 'path';
import url from 'url';
import { createDevWindow, createWindow, handleSecondProcessCall } from './window/mainWindow';

const createMainWindow = () => {
  let startURL = process.env.ELECTRON_START_URL;

  if (startURL) {
    createDevWindow(startURL);
  } else {
    startURL = url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    });

    createWindow(startURL);
  }
};

const bootstrap = () => {
  // If a second instance is started - we close it
  if (!app.requestSingleInstanceLock()) {
    app.quit();
  }

  // Create the main window on start
  app.on('ready', createMainWindow);

  // Handle multiple instances
  app.on('second-instance', (event, commandLine) => handleSecondProcessCall(commandLine));

  // Quit when all windows are closed.
  app.on('window-all-closed', app.quit);
};

bootstrap();
