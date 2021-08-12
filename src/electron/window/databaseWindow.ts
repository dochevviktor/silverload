import * as SLEvent from '../../common/class/SLEvent';
import SLBrowserWindow from '../class/SLBrowserWindow';
import { SL_DATABASE } from '../../common/class/SLPoint';
import { BrowserWindowConstructorOptions } from 'electron';

const isDev = process.env.ELECTRON_START_URL != null;
const title = 'Database window';
const preload = 'databaseHandler.js';

const loadListeners = () => {
  const dbPath = isDev ? 'storage.db' : `${process.resourcesPath}\\storage.db`;

  console.log('Loading db IPC Main listeners');

  SLEvent.GET_DB_PATH.onMain(() => dbPath);

  SLEvent.LOAD_SETTINGS.onMain();
  SLEvent.SAVE_SETTINGS.onMain();

  SLEvent.LOAD_TABS.onMain();
  SLEvent.SAVE_TABS.onMain();
  SLEvent.DELETE_TABS.onMain();
};

const createDbWindow = (): SLBrowserWindow => {
  const opt: BrowserWindowConstructorOptions = {
    show: isDev,
    webPreferences: {
      javascript: false,
      images: false,
      webgl: false,
      spellcheck: false,
      enableWebSQL: false,
    },
  };

  return new SLBrowserWindow(title, preload, SL_DATABASE, loadListeners, opt);
};

export default createDbWindow;
