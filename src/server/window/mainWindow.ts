import { BrowserWindow, Menu } from 'electron';

let mainWindow = null;

const loadWindowListeners = () => {
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.webContents.on('closed', () => (mainWindow = null));
  mainWindow.webContents.on('context-menu', (e, props) => mainContext(e, props));
};

const mainContext = (e, props) => {
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

export const createWindow = (startUrl: string): void => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minWidth: 240,
    minHeight: 70,
    frame: false,
    icon: 'icon.ico',
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      enableRemoteModule: true,
      webSecurity: false,
    },
  });

  mainWindow.loadURL(startUrl);

  loadWindowListeners();
};

export const createDevWindow = (startUrl: string): void => {
  createWindow(startUrl);
  mainWindow.webContents.openDevTools();
};

export const handleSecondProcessCall = async (commandLine: string[]): Promise<void> => {
  console.log(commandLine);
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  }
};
