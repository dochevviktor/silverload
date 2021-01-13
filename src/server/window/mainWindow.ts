import { BrowserWindow, Menu, ipcMain, ContextMenuParams } from 'electron';
import { existsSync, lstatSync, readFileSync } from 'fs';
import { lookup } from 'mime-types';
import { basename } from 'path';
import { SLFile } from '../../common/interface/SLFile';
import { SLEvent } from '../../common/constant/SLEvent';

const loadInitListeners = (mainWindow: BrowserWindow) => {
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
};

const loadFrameManipulationListeners = (mainWindow: BrowserWindow) => {
  ipcMain.on(SLEvent.MINIMIZE_WINDOW, () => mainWindow.minimize());
  ipcMain.on(SLEvent.MAXIMIZE_WINDOW, () =>
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
  );
  ipcMain.on(SLEvent.GET_FILE_ARGUMENTS, (event) => (event.returnValue = getSLFilesFromArgs(process.argv)));

  mainWindow.on('maximize', () => mainWindow.webContents.send(SLEvent.WINDOW_MAXIMIZED));
  mainWindow.on('unmaximize', () => mainWindow.webContents.send(SLEvent.WINDOW_UN_MAXIMIZED));
};

const getSLFilesFromArgs = (argList: string[]): SLFile[] => {
  const resultList = [];

  argList
    .slice(1) // first element is always the process itself - skip it
    .filter((it) => existsSync(it) && lstatSync(it).isFile())
    .forEach((it) => {
      const mimeType = lookup(it);
      const base64 = readFileSync(it, { encoding: 'base64' });
      const name = basename(it);
      const file: SLFile = { name: name, base64: `data:${mimeType};base64,${base64}`, mimeType: mimeType, path: it };

      resultList.push(file);
    });

  return resultList;
};

const mainContext = (mainWindow: BrowserWindow, e: Event, props: ContextMenuParams) => {
  const { x, y } = props;

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

  return mainWindow;
};

export const createDevWindow = (startUrl: string): BrowserWindow => {
  const mainWindow = createWindow(startUrl);

  mainWindow.webContents.openDevTools();

  return mainWindow;
};

export const handleSecondProcessCall = async (mainWindow: BrowserWindow, commandLine: string[]): Promise<void> => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
    mainWindow.webContents.send(SLEvent.SENT_FILE_ARGUMENTS, getSLFilesFromArgs(commandLine));
  }
};
