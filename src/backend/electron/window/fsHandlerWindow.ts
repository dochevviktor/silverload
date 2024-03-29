import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import SLEvent from '../../../common/class/SLEvent';
import { SL_FILE_SYSTEM } from '../../../common/class/SLPoint';
import SLBrowserWindow from '../class/SLBrowserWindow';

const isDev = process.env.ELECTRON_START_URL != null;
const title = 'File System handler window';
const preload = 'fsHandler.js';

const loadListeners = (win: BrowserWindow) => {
  console.log('Loading FS Handler handler IPC Main listeners');

  SLEvent.LOAD_FILE_ARGUMENTS.onMain(() => process.argv);
  SLEvent.SEND_SL_FILES.onMain();
  SLEvent.LOAD_TAB_IMAGE.onMain();
  SLEvent.LOAD_NEXT_TAB_IMAGE.onMain();
  SLEvent.LOAD_PREV_TAB_IMAGE.onMain();
  SLEvent.LOAD_NEXT_TAB_DATE_IMAGE.onMain();
  SLEvent.LOAD_PREV_TAB_DATE_IMAGE.onMain();

  app.on('second-instance', (event, commandLine) => loadAdditionalFiles(win, commandLine));
};

const loadAdditionalFiles = async (fsWindow: BrowserWindow, commandLine: string[]): Promise<void> => {
  console.log('Handling call from second process with args: ', commandLine);
  SLEvent.SEND_ADDITIONAL_FILE_ARGUMENTS.sendMain(commandLine);
};

const createFsWindow = (): SLBrowserWindow => {
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

  return new SLBrowserWindow(title, preload, SL_FILE_SYSTEM, loadListeners, opt);
};

export default createFsWindow;
