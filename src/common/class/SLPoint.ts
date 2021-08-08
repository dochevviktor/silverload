import { WebContents } from 'electron';

export class SLPoint {
  // in the future, we can use an array of contents
  public webContents?: WebContents;
}

export const SL_REACT = new SLPoint();
export const SL_FILE_SYSTEM = new SLPoint();
export const SL_DATABASE = new SLPoint();
