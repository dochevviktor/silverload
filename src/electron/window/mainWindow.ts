import { app, BrowserWindow, BrowserWindowConstructorOptions, ContextMenuParams, Menu } from 'electron';
import * as SLEvent from '../../common/class/SLEvent';
import { SL_REACT } from '../../common/class/SLPoint';
import SLBrowserWindow from '../class/SLBrowserWindow';

const loadListeners = (win: BrowserWindow) => {
  win.webContents.on('did-finish-load', () => {
    if (!win) {
      throw new Error('"win" is not defined');
    } else {
      win.show();
      win.focus();
    }
  });

  win.webContents.on('context-menu', (e, props) => mainContext(win, e, props));

  SLEvent.MINIMIZE_WINDOW.onMain(() => win.minimize());
  SLEvent.MAXIMIZE_WINDOW.onMain(() => (win.isMaximized() ? win.unmaximize() : win.maximize()));

  win.on('maximize', () => SLEvent.WINDOW_MAXIMIZED.sendMain());
  win.on('unmaximize', () => SLEvent.WINDOW_UN_MAXIMIZED.sendMain());

  app.on('second-instance', () => restoreMainWindow(win));
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

const restoreMainWindow = (mainWindow: BrowserWindow): void => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  }
};

const createWindow = (): SLBrowserWindow => {
  const opt: BrowserWindowConstructorOptions = {
    width: 1024,
    height: 728,
    minWidth: 240,
    minHeight: 70,
    frame: false,
  };
  const win = new SLBrowserWindow('Main Window', 'preload.js', SL_REACT, loadListeners, opt);
  const startURL = process.env.ELECTRON_START_URL;

  if (startURL) {
    win.setLoadUrl(startURL);
  } else {
    win.setLoadPath('index.html');
  }

  return win;
};

export default createWindow;
