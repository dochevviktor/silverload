import { BrowserWindow, ContextMenuParams, ipcMain, Menu } from 'electron';
import { SLEvent } from '../../common/constant/SLEvent';

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

  ipcMain.on(SLEvent.GET_MAIN_WINDOW_CONTENTS_ID, (event) => (event.returnValue = mainWindow.webContents.id));
};

const loadFrameManipulationListeners = (mainWindow: BrowserWindow) => {
  console.log('Load Frame Manipulation Listeners');
  ipcMain.on(SLEvent.MINIMIZE_WINDOW, () => mainWindow.minimize());
  ipcMain.on(SLEvent.MAXIMIZE_WINDOW, () =>
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
  );

  mainWindow.on('maximize', () => mainWindow.webContents.send(SLEvent.WINDOW_MAXIMIZED));
  mainWindow.on('unmaximize', () => mainWindow.webContents.send(SLEvent.WINDOW_UN_MAXIMIZED));
};

const mainContext = (mainWindow: BrowserWindow, e: Event, props: ContextMenuParams) => {
  const { x, y } = props;

  console.log('Call to conext menu at X:', x, ' Y:', y);

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

  mainWindow.loadURL(startUrl);

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
