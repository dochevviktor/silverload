import { BrowserWindow, ContextMenuParams, Menu } from 'electron';
import * as SLEvent from '../../common/class/SLEvent';
import path from 'path';
import { SL_REACT } from '../../common/class/SLPoint';

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

  mainWindow.webContents.on('context-menu', (e, props) => mainContext(mainWindow, e, props));
};

const loadFrameManipulationListeners = (mainWindow: BrowserWindow) => {
  console.log('Load Frame Manipulation Listeners');

  SLEvent.MINIMIZE_WINDOW.onMain(() => mainWindow.minimize());
  SLEvent.MAXIMIZE_WINDOW.onMain(() => (mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()));

  mainWindow.on('maximize', () => SLEvent.WINDOW_MAXIMIZED.sendMain());
  mainWindow.on('unmaximize', () => SLEvent.WINDOW_UN_MAXIMIZED.sendMain());
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
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      enableRemoteModule: false,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  SL_REACT.add(mainWindow.webContents);
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
