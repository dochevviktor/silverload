import { BrowserWindowConstructorOptions } from 'electron';
import SLEvent from '../../../common/class/SLEvent';
import SLBrowserWindow from '../class/SLBrowserWindow';
import { SL_FFMPEG } from '../../../common/class/SLPoint';

const isDev = process.env.ELECTRON_START_URL != null;
const title = 'FFMPEG handler window';
const preload = 'preload.js';

const loadListeners = () => {
  SLEvent.LOAD_TAB_GIF_VIDEO.onMain();
  SLEvent.LOAD_TAB_GIF_VIDEO_PROGRESS.onMain();
};

const createFfmpegWindow = (addListeners = true): SLBrowserWindow => {
  const opt: BrowserWindowConstructorOptions = { show: isDev };
  const win = new SLBrowserWindow(title, preload, SL_FFMPEG, addListeners ? loadListeners : null, opt);
  const startURL = process.env.ELECTRON_START_URL;

  if (startURL) {
    win.setLoadUrl(`${startURL}/ffmpeg.html`);
  } else {
    win.setLoadPath('ffmpeg.html');
    // Needed for the SharedArrayBuffer
    win.browserWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      details.responseHeaders['Cross-Origin-Embedder-Policy'] = ['require-corp'];
      details.responseHeaders['Cross-Origin-Opener-Policy'] = ['same-origin'];
      callback({ responseHeaders: details.responseHeaders });
    });
  }

  return win;
};

export default createFfmpegWindow;
