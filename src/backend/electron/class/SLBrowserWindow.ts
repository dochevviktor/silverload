import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import path from 'path';
import { SLPoint } from '../../../common/class/SLPoint';
import merge from 'webpack-merge';

const isDev = process.env.ELECTRON_START_URL != null;

export default class SLBrowserWindow {
  browserWindow: BrowserWindow;
  load: () => Promise<void>;
  constructor(
    title: string,
    preload: string,
    point: SLPoint,
    loadListeners: (win: BrowserWindow) => void,
    options: BrowserWindowConstructorOptions
  ) {
    console.log('Creating new BrowserWindow for', title);

    this.browserWindow = new BrowserWindow(
      merge(
        {
          show: false,
          closable: false,
          title,
          icon: 'icon.ico',
          webPreferences: {
            nodeIntegration: false,
            nodeIntegrationInWorker: false,
            enableRemoteModule: false,
            contextIsolation: false,
            preload: path.join(__dirname, preload),
          },
        },
        options
      )
    );

    point.add(this.browserWindow.webContents);

    if (isDev) this.browserWindow.webContents.openDevTools();

    if (loadListeners) loadListeners(this.browserWindow);

    this.load = () => this.browserWindow.loadFile(path.join(__dirname, preload));
    console.log('Created new BrowserWindow for', title, 'id:', this.browserWindow.webContents.id);
  }

  setLoadUrl = (url: string): void => {
    this.load = () => this.browserWindow.loadURL(url);
  };

  setLoadPath = (fileName: string): void => {
    this.load = () => this.browserWindow.loadFile(path.join(__dirname, fileName));
  };
}