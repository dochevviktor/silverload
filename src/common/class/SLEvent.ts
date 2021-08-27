import { IpcRenderer, IpcRendererEvent } from 'electron';
import { SLTabImageData } from '../interface/SLTabImageData';
import { SLFile } from '../interface/SLFile';
import SLTab from './SLTab';
import SLSettings from './SLSettings';
import { SLPoint, SL_DATABASE, SL_REACT, SL_FILE_SYSTEM, SL_FFMPEG, SL_ALL } from './SLPoint';
import { PayloadAction } from '@reduxjs/toolkit';
import { SLContextMenuData } from '../constant/SLContextMenu';

let lastChannelId = 0;
let globalSettings: SLSettings[] = [];

export const getGlobalSettings = (): SLSettings[] => globalSettings;
export const setGlobalSettings = (s: SLSettings[]) => (globalSettings = s);

/**
 * Event class for wrapping Electron IPC event calls b/w Main and Render processes with type safety.<br>
 * Type declaration:
 * - SLEvent() -> type is set to void
 * - SLEvent<X>() -> type is set to X and the type is check at both source and destination.
 *
 * Source and destination logic:
 * - SLEvent() -> call goes to main process, where some action is done and no return action is done
 * - SLEvent(A) -> call goes to main process, where some action is done, then result is sent to A
 * - SLEvent(A, B) -> call goes to B, where some action is done then result is sent to A
 *
 * All these calls can be done from any process, not just the involved A or B.<br>
 * For example, in C we could call SLEvent(A, B), where A could process data sent by C and then return the result to B.
 */
export class SLEvent<T = void> {
  private readonly channel: string;
  private readonly origin?: SLPoint;
  private readonly destination?: SLPoint;

  public constructor(origin?: SLPoint, destination?: SLPoint) {
    this.channel = (++lastChannelId).toString();
    this.origin = origin;
    this.destination = destination;
  }

  /*
   * Render Process methods
   */
  send(arg?: T): void {
    global.ipcRenderer.send(this.channel, arg);
  }

  sendBack(fn: (arg: T, event: IpcRendererEvent) => T | Promise<T>): void {
    global.ipcRenderer.on(this.channel, async (event, arg: T) => this.send(await fn(arg, event)));
  }

  on(
    fn: (arg: T, event: IpcRendererEvent) => T | Promise<T> | void | Promise<void> | PayloadAction<unknown>
  ): () => IpcRenderer {
    global.ipcRenderer.on(this.channel, (event, arg: T) => fn(arg, event));

    return () => global.ipcRenderer.removeListener(this.channel, (event, arg: T) => fn(arg, event));
  }

  /*
   * Main Process methods
   */
  onMain(fn?: (arg: T) => T | Promise<T> | void | Promise<void> | PayloadAction<T>): void {
    global.ipcMain.on(this.channel, async (event, arg: T) => {
      if (this.destination) {
        if (!this.origin?.contains(event.sender.id)) {
          this.origin.get().send(this.channel, arg);
        } else {
          this.destination.get().send(this.channel, arg);
        }
      } else {
        if (this.origin) {
          this.origin.get().send(this.channel, await fn(arg));
        } else {
          await fn(arg);
        }
      }
    });
  }

  sendMain(arg?: T): void {
    if (this.destination) {
      this.destination.get().send(this.channel, arg);
    } else {
      this.origin?.get()?.send(this.channel, arg);
    }
  }

  onBroadcast(fn: (arg: T) => T | Promise<T> | void | Promise<void> | PayloadAction<unknown>): void {
    global.ipcMain.on(this.channel, (event, arg: T) => {
      console.log('Main got the broadcast request', arg);
      fn(arg);
      this.origin.getAll().forEach((webContent) => webContent.send(this.channel, arg));
    });
  }
}

// React
export const MINIMIZE_WINDOW = new SLEvent();
export const MAXIMIZE_WINDOW = new SLEvent();
export const CLOSE_WINDOW = new SLEvent();
export const WINDOW_MAXIMIZED = new SLEvent(SL_REACT);
export const WINDOW_UN_MAXIMIZED = new SLEvent(SL_REACT);

// Context Menu
export const TAB_CTX_MENU = new SLEvent<SLContextMenuData<string>>(SL_REACT);

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
export const LOAD_FILE_ARGUMENTS = new SLEvent<string[]>(SL_FILE_SYSTEM);
export const SEND_SL_FILES = new SLEvent<SLFile[]>(SL_FILE_SYSTEM, SL_REACT);
export const SEND_ADDITIONAL_FILE_ARGUMENTS = new SLEvent<string[]>(SL_FILE_SYSTEM);
export const LOAD_TAB_IMAGE = new SLEvent<SLTabImageData>(SL_REACT, SL_FILE_SYSTEM);
export const LOAD_NEXT_TAB_IMAGE = new SLEvent<SLTabImageData>(SL_REACT, SL_FILE_SYSTEM);
export const LOAD_PREV_TAB_IMAGE = new SLEvent<SLTabImageData>(SL_REACT, SL_FILE_SYSTEM);

// FFMPEG
export const LOAD_TAB_GIF_VIDEO = new SLEvent<SLTabImageData>(SL_FFMPEG, SL_REACT);
export const LOAD_TAB_GIF_VIDEO_PROGRESS = new SLEvent<SLTabImageData>(SL_FFMPEG, SL_REACT);

// Broadcast
export const UPDATE_SETTINGS = new SLEvent<SLSettings[]>(SL_ALL);
