import { IpcRenderer, IpcRendererEvent } from 'electron';
import { PayloadAction } from '@reduxjs/toolkit';
import { SLTabImageData } from '../interface/SLTabImageData';
import { SLFile } from '../interface/SLFile';
import { SLContextMenuData } from '../constant/SLContextMenu';
import SLTab from './SLTab';
import SLSettings, { findSetting, SLSetting } from './SLSettings';
import { SLPoint, SL_DATABASE, SL_REACT, SL_FILE_SYSTEM, SL_FFMPEG, SL_ALL } from './SLPoint';

let lastChannelId = 0;
let globalSettings: SLSettings[] = [];

export const findGlobalSettings = (s: SLSetting): SLSettings => findSetting(globalSettings, s);
export const setGlobalSettings = (s: SLSettings[]): SLSettings[] => (globalSettings = s);

/**
 * Event class for wrapping Electron IPC event calls b/w Main and Render processes with type safety.<br>
 * Type declaration:
 * - SLEventClass() -> type is set to void
 * - SLEventClass<X>() -> type is set to X and the type is check at both source and destination.
 *
 * Source and destination logic:
 * - SLEventClass() -> call goes to main process, where some action is done and no return action is done
 * - SLEventClass(A) -> call goes to main process, where some action is done, then result is sent to A
 * - SLEventClass(A, B) -> call goes to B, where some action is done then result is sent to A
 *
 * All these calls can be done from any process, not just the involved A or B.<br>
 * For example, in C we could call SLEventClass(A, B), where A could process data sent by C and then return the result to B.
 */
export class SLEventClass<T = void> {
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

const SLEvent = {
  // React
  MINIMIZE_WINDOW: new SLEventClass(),
  MAXIMIZE_WINDOW: new SLEventClass(),
  CLOSE_WINDOW: new SLEventClass(),
  WINDOW_MAXIMIZED: new SLEventClass(SL_REACT),
  WINDOW_UN_MAXIMIZED: new SLEventClass(SL_REACT),

  // Context Menu
  TAB_CTX_MENU: new SLEventClass<SLContextMenuData<string>>(SL_REACT),

  // Database SLTabs
  SAVE_TABS: new SLEventClass<SLTab[]>(SL_REACT, SL_DATABASE),
  LOAD_TABS: new SLEventClass<SLTab[]>(SL_REACT, SL_DATABASE),
  DELETE_TABS: new SLEventClass(SL_REACT, SL_DATABASE),

  // Database SLSettings
  SAVE_SETTINGS: new SLEventClass<SLSettings[]>(SL_REACT, SL_DATABASE),
  LOAD_SETTINGS: new SLEventClass<SLSettings[]>(SL_REACT, SL_DATABASE),

  // File System
  LOAD_FILE_ARGUMENTS: new SLEventClass<string[]>(SL_FILE_SYSTEM),
  SEND_SL_FILES: new SLEventClass<SLFile[]>(SL_FILE_SYSTEM, SL_REACT),
  SEND_ADDITIONAL_FILE_ARGUMENTS: new SLEventClass<string[]>(SL_FILE_SYSTEM),
  LOAD_TAB_IMAGE: new SLEventClass<SLTabImageData>(SL_REACT, SL_FILE_SYSTEM),
  LOAD_NEXT_TAB_IMAGE: new SLEventClass<SLTabImageData>(SL_REACT, SL_FILE_SYSTEM),
  LOAD_PREV_TAB_IMAGE: new SLEventClass<SLTabImageData>(SL_REACT, SL_FILE_SYSTEM),

  // FFMPEG
  LOAD_TAB_GIF_VIDEO: new SLEventClass<SLTabImageData>(SL_FFMPEG, SL_REACT),
  LOAD_TAB_GIF_VIDEO_PROGRESS: new SLEventClass<SLTabImageData>(SL_FFMPEG, SL_REACT),

  // Broadcast
  UPDATE_SETTINGS: new SLEventClass<SLSettings[]>(SL_ALL),
};

export default SLEvent;
