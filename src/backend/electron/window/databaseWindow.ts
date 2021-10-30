import { BrowserWindowConstructorOptions } from 'electron';
import SLEvent from '../../../common/class/SLEvent';
import SLBrowserWindow from '../class/SLBrowserWindow';
import { SL_DATABASE } from '../../../common/class/SLPoint';

const isDev = process.env.ELECTRON_START_URL != null;
const title = 'Database window';
const preload = 'preload.js';

const loadListeners = () => {
  console.log('Loading db IPC Main listeners');

  SLEvent.LOAD_SETTINGS.onMain();
  SLEvent.SAVE_SETTINGS.onMain();

  SLEvent.LOAD_TABS.onMain();
  SLEvent.SAVE_TABS.onMain();
  SLEvent.DELETE_TABS.onMain();
};

const createDbWindow = (): SLBrowserWindow => {
  const opt: BrowserWindowConstructorOptions = { show: isDev };
  const win = new SLBrowserWindow(title, preload, SL_DATABASE, loadListeners, opt);
  const startURL = process.env.ELECTRON_START_URL;

  if (startURL) {
    win.setLoadUrl(`${startURL}/database.html`);
  } else {
    win.setLoadPath('database.html');
  }

  return win;
};

export default createDbWindow;
