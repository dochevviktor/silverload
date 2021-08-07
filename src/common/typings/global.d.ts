import { IpcMain, IpcRenderer } from 'electron';

export {};
declare global {
  interface Window {
    ipcRenderer: IpcRenderer;
    ipcMain: IpcMain;
  }
}
