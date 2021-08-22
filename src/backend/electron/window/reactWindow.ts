import { app, BrowserWindow, BrowserWindowConstructorOptions, Menu, MenuItemConstructorOptions } from 'electron';
import * as SLEvent from '../../../common/class/SLEvent';
import { SL_REACT } from '../../../common/class/SLPoint';
import SLBrowserWindow from '../class/SLBrowserWindow';
import SLContextMenuItem from '../../../common/constant/SLContextMenu';
import { reactContext, reactTabContext } from '../menu/reactContextMenu';

const title = 'React Window';
const preload = 'preload.js';

const loadListeners = (win: BrowserWindow) => {
  win.webContents.on('did-finish-load', () => {
    if (!win) {
      throw new Error('"win" is not defined');
    } else {
      win.show();
      win.focus();
    }
  });

  SLEvent.MINIMIZE_WINDOW.onMain(() => win.minimize());
  SLEvent.MAXIMIZE_WINDOW.onMain(() => (win.isMaximized() ? win.unmaximize() : win.maximize()));
  SLEvent.CLOSE_WINDOW.onMain(closeAllWindows);

  win.webContents.on('context-menu', (e, { x, y }) => reactContext(win, x, y));
  SLEvent.TAB_CTX_MENU.onMain(({ context, x, y }) => reactContext(win, x, y, reactTabContext(context)));

  win.on('maximize', () => SLEvent.WINDOW_MAXIMIZED.sendMain());
  win.on('unmaximize', () => SLEvent.WINDOW_UN_MAXIMIZED.sendMain());

  app.on('second-instance', () => restoreReactWindow(win));
  win.on('closed', closeAllWindows);
};

const restoreReactWindow = (reactWindow: BrowserWindow): void => {
  if (reactWindow) {
    if (reactWindow.isMinimized()) {
      reactWindow.restore();
    }
    reactWindow.focus();
  }
};

const createReactWindow = (): SLBrowserWindow => {
  const opt: BrowserWindowConstructorOptions = {
    width: 1024,
    height: 728,
    minWidth: 240,
    minHeight: 70,
    frame: false,
  };
  const win = new SLBrowserWindow(title, preload, SL_REACT, loadListeners, opt);
  const startURL = process.env.ELECTRON_START_URL;

  if (startURL) {
    win.setLoadUrl(startURL);
  } else {
    win.setLoadPath('index.html');
  }

  return win;
};

const closeAllWindows = () => {
  console.log('Closing all windows');
  app.quit();
  app.exit(0);
};

export default createReactWindow;
