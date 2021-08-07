import { IpcRenderer } from 'electron';
import { SLTabImageData } from '../interface/SLTabImageData';
import { SLFile } from '../interface/SLFile';
import SLTab from './SLTab';
import SLSettings from './SLSettings';
import { SLPoint, SL_DATABASE, SL_REACT, SL_FILE_SYSTEM } from './SLPoint';
import { PayloadAction } from '@reduxjs/toolkit';

let lastChannelId = 0;

export class SLEvent<T = void> {
  private readonly channel: string;
  private readonly origin?: SLPoint;
  private readonly destination?: SLPoint;

  public constructor(origin?: SLPoint, destination?: SLPoint) {
    this.channel = (++lastChannelId).toString();
    this.origin = origin;
    this.destination = destination;
  }

  send(arg?: T): void {
    window.ipcRenderer.send(this.channel, arg);
  }

  sendMain(arg?: T): void {
    this.destination?.webContents?.send(this.channel, arg);
  }

  sendBack(fn: (arg: T, event) => T | Promise<T>): void {
    window.ipcRenderer.on(this.channel, async (event, arg: T) => this.send(await fn(arg, event)));
  }

  on(fn: (arg: T, event) => T | Promise<T> | void | Promise<void> | PayloadAction<T>): () => IpcRenderer {
    window.ipcRenderer.on(this.channel, (event, arg: T) => fn(arg, event));

    return () => window.ipcRenderer.removeListener(this.channel, (event, arg: T) => fn(arg, event));
  }

  onMain(fn?: (arg: T, event) => T | Promise<T> | void | Promise<void> | PayloadAction<T>): void {
    global.ipcMain.on(this.channel, async (event, arg: T) => {
      if (this.destination) {
        if (event.sender.id !== this.origin?.webContents?.id) {
          this.origin.webContents.send(this.channel, arg);
        } else {
          this.destination.webContents.send(this.channel, arg);
        }
      } else {
        if (this.origin) {
          this.origin.webContents.send(this.channel, await fn(arg, event));
        } else {
          await fn(arg, event);
        }
      }
    });
  }

  once(fn: (arg: T, event) => void): void {
    window.ipcRenderer.once(this.channel, (event, arg: T) => fn(arg, event));
  }
}

// React
export const MINIMIZE_WINDOW = new SLEvent();
export const MAXIMIZE_WINDOW = new SLEvent();
export const CLOSE_WINDOW = new SLEvent();
export const WINDOW_MAXIMIZED = new SLEvent(null, SL_REACT);
export const WINDOW_UN_MAXIMIZED = new SLEvent(null, SL_REACT);

// Database Generic
export const GET_DB_PATH = new SLEvent<string>(SL_DATABASE);

// Database SLTabs
export const SAVE_TABS = new SLEvent<SLTab[]>(SL_REACT, SL_DATABASE);
export const LOAD_TABS = new SLEvent<SLTab[]>(SL_REACT, SL_DATABASE);
export const DELETE_TABS = new SLEvent(SL_REACT, SL_DATABASE);

// Database SLSettings
export const SAVE_SETTINGS = new SLEvent<SLSettings[]>(SL_REACT, SL_DATABASE);
export const LOAD_SETTINGS = new SLEvent<SLSettings[]>(SL_REACT, SL_DATABASE);

// File System
export const LOAD_FILE_ARGUMENTS = new SLEvent<string[]>(SL_REACT, SL_FILE_SYSTEM);
export const GET_FILE_ARGUMENTS_FROM_MAIN = new SLEvent<string[]>(SL_FILE_SYSTEM);
export const SEND_SL_FILES = new SLEvent<SLFile[]>(SL_FILE_SYSTEM, SL_REACT);
export const SEND_ADDITIONAL_FILE_ARGUMENTS = new SLEvent<string[]>(null, SL_FILE_SYSTEM);
export const LOAD_TAB_IMAGE = new SLEvent<SLTabImageData>(SL_REACT, SL_FILE_SYSTEM);
export const LOAD_TAB_GIF_VIDEO = new SLEvent<SLTabImageData>(SL_REACT, SL_FILE_SYSTEM);
