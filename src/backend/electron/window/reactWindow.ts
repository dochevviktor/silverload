import { app, BrowserWindow, BrowserWindowConstructorOptions, ContextMenuParams, Menu } from 'electron';
import * as SLEvent from '../../../common/class/SLEvent';
import { SL_REACT } from '../../../common/class/SLPoint';
import SLBrowserWindow from '../class/SLBrowserWindow';

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

  win.webContents.on('context-menu', (e, props) => reactContext(win, e, props));

  SLEvent.MINIMIZE_WINDOW.onMain(() => win.minimize());
  SLEvent.MAXIMIZE_WINDOW.onMain(() => (win.isMaximized() ? win.unmaximize() : win.maximize()));
  SLEvent.CLOSE_WINDOW.onMain(closeAllWindows);

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

const reactContext = (reactWindow: BrowserWindow, e: Event, props: ContextMenuParams) => {
  const { x, y } = props;

  console.log('Call to context menu at X:', x, ' Y:', y);

  Menu.buildFromTemplate([
    {
      label: 'Reload',
      click: () => reactWindow.reload(),
    },
    {
      label: 'Inspect element',
      click: () => reactWindow.webContents.inspectElement(x, y),
    },
  ]).popup({ window: reactWindow });
};

export default createReactWindow;
