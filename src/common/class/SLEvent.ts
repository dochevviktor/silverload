import { IpcMain, IpcRenderer, WebContents } from 'electron';
import { SLTabImageData } from '../interface/SLTabImageData';
import { SLFile } from '../interface/SLFile';
import SLTab from './SLTab';
import SLSettings from './SLSettings';

let lastChannelId = 0;

export class SLEvent<T = void> {
  public constructor(private readonly channel?: string) {
    this.channel = (++lastChannelId).toString();
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
export const GET_MAIN_WINDOW_CONTENTS_ID = new SLEvent<number>();
export const MINIMIZE_WINDOW = new SLEvent();
export const MAXIMIZE_WINDOW = new SLEvent();
export const CLOSE_WINDOW = new SLEvent();
export const WINDOW_MAXIMIZED = new SLEvent();
export const WINDOW_UN_MAXIMIZED = new SLEvent();

// Database Generic
export const GET_DATABASE_HANDLER_CONTENTS_ID = new SLEvent<number>();
export const GET_DB_PATH = new SLEvent<string>();

// Database SLTabs
export const SAVE_TABS = new SLEvent<SLTab[]>();
export const LOAD_TABS = new SLEvent<SLTab[]>();
export const DELETE_TABS = new SLEvent();

// Database SLSettings
export const SAVE_SETTINGS = new SLEvent<SLSettings[]>();
export const LOAD_SETTINGS = new SLEvent<SLSettings[]>();

// File System
export const GET_FS_HANDLER_CONTENTS_ID = new SLEvent<number>();
export const GET_FILE_ARGUMENTS = new SLEvent<string[]>();
export const SEND_SL_FILES = new SLEvent<SLFile[]>();
export const GET_ADDITIONAL_FILE_ARGUMENTS = new SLEvent<string[]>();
export const LOAD_TAB_IMAGE = new SLEvent<SLTabImageData>();

// FFMPEG
export const GET_FFMPEG_HANDLER_CONTENTS_ID = new SLEvent<number>();
export const GET_FFMPEG_EXECUTABLE_PATH = new SLEvent<string>();
export const LOAD_TAB_GIF_VIDEO = new SLEvent<SLTabImageData>();
