import { app, BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import * as SLEvent from '../../common/class/SLEvent';
import { SL_FILE_SYSTEM } from '../../common/class/SLPoint';
import SLBrowserWindow from '../class/SLBrowserWindow';

const isDev = process.env.ELECTRON_START_URL != null;

const loadListeners = (win: BrowserWindow) => {
  console.log('Loading FS Handler handler IPC Main listeners');

  SLEvent.LOAD_FILE_ARGUMENTS.onMain(() => process.argv);
  SLEvent.SEND_SL_FILES.onMain();
  SLEvent.LOAD_TAB_IMAGE.onMain();
  SLEvent.LOAD_TAB_GIF_VIDEO.onMain();

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

  return new SLBrowserWindow('File System handler window', 'fsHandler.js', SL_FILE_SYSTEM, loadListeners, opt);
};

export default createFsWindow;
