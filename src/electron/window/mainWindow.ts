import { BrowserWindow, ContextMenuParams, ipcMain, Menu } from 'electron';
import * as SLEvent from '../../common/class/SLEvent';

const loadInitListeners = (mainWindow: BrowserWindow) => {
  console.log('Load Init Listeners');
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => (mainWindow = null));
  mainWindow.webContents.on('context-menu', (e, props) => mainContext(mainWindow, e, props));

  SLEvent.GET_MAIN_WINDOW_CONTENTS_ID.onSync(ipcMain, mainWindow.webContents.id);
};

const loadFrameManipulationListeners = (mainWindow: BrowserWindow) => {
  console.log('Load Frame Manipulation Listeners');

  SLEvent.MINIMIZE_WINDOW.on(ipcMain, () => mainWindow.minimize());
  SLEvent.MAXIMIZE_WINDOW.on(ipcMain, () =>
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
  );

  mainWindow.on('maximize', () => SLEvent.WINDOW_MAXIMIZED.send(mainWindow.webContents));
  mainWindow.on('unmaximize', () => SLEvent.WINDOW_UN_MAXIMIZED.send(mainWindow.webContents));
};

const mainContext = (mainWindow: BrowserWindow, e: Event, props: ContextMenuParams) => {
  const { x, y } = props;

  console.log('Call to context menu at X:', x, ' Y:', y);

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

export const createWindow = (startUrl: string): BrowserWindow => {
  console.log('Creating Main Window');
  const mainWindow = new BrowserWindow({
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

  mainWindow.loadURL(startUrl).catch(console.error);

  loadInitListeners(mainWindow);
  loadFrameManipulationListeners(mainWindow);

  console.log('Created Main Window');

  return mainWindow;
};

export const createDevWindow = (startUrl: string): BrowserWindow => {
  const mainWindow = createWindow(startUrl);

  mainWindow.webContents.openDevTools();

  return mainWindow;
};

export const restoreMainWindow = (mainWindow: BrowserWindow): void => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  }
};
