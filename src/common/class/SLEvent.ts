import { IpcMain, IpcRenderer, WebContents } from 'electron';
import { SLTabImageData } from '../interface/SLTabImageData';
import { SLFile } from '../interface/SLFile';
import SLTab from './SLTab';
import SLSettings from './SLSettings';

export class SLEvent<T = null> {
  public constructor(private readonly channel: string) {}

  send(ipc: WebContents | IpcRenderer, arg?: T): void {
    ipc.send(this.channel, arg);
  }

  sendTo(ipc: IpcRenderer, webContentsId: number, arg?: T): void {
    ipc.sendTo(webContentsId, this.channel, arg);
  }

  sendSync(ipc: IpcRenderer): T {
    return ipc.sendSync(this.channel);
  }

  on(ipc: IpcRenderer | IpcMain, fn: (arg: T, event) => void): () => IpcRenderer | IpcMain {
    ipc.on(this.channel, (event, arg: T) => fn(arg, event));

    return () => ipc.removeListener(this.channel, (event, arg: T) => fn(arg, event));
  }

  once(ipc: IpcRenderer, fn: (arg: T, event) => void): void {
    ipc.once(this.channel, (event, arg: T) => fn(arg, event));
  }

  sendBack(ipc: IpcRenderer, fn: (arg: T, event) => T | Promise<T> | void): void {
    ipc.on(this.channel, async (event, arg: T) => {
      ipc.sendTo(event.senderId, this.channel, await fn(arg, event));
    });
  }

  onSync(ipc: IpcMain, arg: T): void {
    ipc.on(this.channel, (event) => (event.returnValue = arg));
  }
}

export const GET_MAIN_WINDOW_CONTENTS_ID = new SLEvent<number>('GET_MAIN_WINDOW_CONTENTS_ID');
export const MINIMIZE_WINDOW = new SLEvent('MINIMIZE_WINDOW');
export const MAXIMIZE_WINDOW = new SLEvent('MAXIMIZE_WINDOW');
export const CLOSE_WINDOW = new SLEvent('CLOSE_WINDOW');
export const WINDOW_MAXIMIZED = new SLEvent('WINDOW_MAXIMIZED');
export const WINDOW_UN_MAXIMIZED = new SLEvent('WINDOW_UN_MAXIMIZED');

// Database Generic
export const GET_DATABASE_HANDLER_CONTENTS_ID = new SLEvent<number>('GET_DATABASE_HANDLER_CONTENTS_ID');
export const GET_DB_PATH = new SLEvent<string>('GET_DB_PATH');
// Database SLTabs
export const SAVE_TABS = new SLEvent<SLTab[]>('SAVE_TABS');
export const LOAD_TABS = new SLEvent<SLTab[]>('LOAD_TABS');
export const DELETE_TABS = new SLEvent<void>('DELETE_TABS');
// Database SLSettings
export const SAVE_SETTINGS = new SLEvent<SLSettings[]>('SAVE_SETTINGS');
export const LOAD_SETTINGS = new SLEvent<SLSettings[]>('LOAD_SETTINGS');

// File System
export const GET_FS_HANDLER_CONTENTS_ID = new SLEvent<number>('GET_FS_HANDLER_CONTENTS_ID');
export const GET_FILE_ARGUMENTS = new SLEvent<string[]>('GET_FILE_ARGUMENTS');
export const SENT_FILE_ARGUMENTS = new SLEvent<SLFile[]>('GET_ADDITIONAL_FILE_ARGUMENTS');
export const GET_ADDITIONAL_FILE_ARGUMENTS = new SLEvent<string[]>('GET_ADDITIONAL_FILE_ARGUMENTS');
export const LOAD_TAB_IMAGE = new SLEvent<SLTabImageData>('LOAD_TAB_IMAGE');
