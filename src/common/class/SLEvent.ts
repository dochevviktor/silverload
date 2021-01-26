import { IpcMain, IpcRenderer, WebContents } from 'electron';
import { SLTabImageData } from '../interface/SLTabImageData';
import { SLFile } from '../interface/SLFile';
import SLTab from './SLTab';
import SLSettings from './SLSettings';

const channels = new Set<string>();

export class SLEvent<T = null> {
  public constructor(private readonly channel: string) {
    if (!channels.has(channel)) {
      this.channel = channel;
      channels.add(channel);
    } else console.error('Duplicate channel id:', channel);
  }

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

// React
export const GET_MAIN_WINDOW_CONTENTS_ID = new SLEvent<number>('001');
export const MINIMIZE_WINDOW = new SLEvent('002');
export const MAXIMIZE_WINDOW = new SLEvent('003');
export const CLOSE_WINDOW = new SLEvent('004');
export const WINDOW_MAXIMIZED = new SLEvent('005');
export const WINDOW_UN_MAXIMIZED = new SLEvent('006');

// Database Generic
export const GET_DATABASE_HANDLER_CONTENTS_ID = new SLEvent<number>('007');
export const GET_DB_PATH = new SLEvent<string>('008');
// Database SLTabs
export const SAVE_TABS = new SLEvent<SLTab[]>('009');
export const LOAD_TABS = new SLEvent<SLTab[]>('010');
export const DELETE_TABS = new SLEvent<void>('011');
// Database SLSettings
export const SAVE_SETTINGS = new SLEvent<SLSettings[]>('012');
export const LOAD_SETTINGS = new SLEvent<SLSettings[]>('013');

// File System
export const GET_FS_HANDLER_CONTENTS_ID = new SLEvent<number>('014');
export const GET_FILE_ARGUMENTS = new SLEvent<string[]>('015');
export const SEND_SL_FILES = new SLEvent<SLFile[]>('016');
export const GET_ADDITIONAL_FILE_ARGUMENTS = new SLEvent<string[]>('017');
export const LOAD_TAB_IMAGE = new SLEvent<SLTabImageData>('018');
