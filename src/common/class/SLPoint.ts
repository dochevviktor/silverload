import { WebContents } from 'electron';

export class SLPoint {
  private readonly webContentsList: WebContents[] = [];

  add(webContents: WebContents): void {
    this.webContentsList.push(webContents);
  }

  //Round robin load balancing
  get(): WebContents {
    const webContents = this.webContentsList.shift();

    this.webContentsList.push(webContents);

    return webContents;
  }

  contains(id: number): boolean {
    return this.webContentsList.find((it) => it.id === id) != null;
  }
}

export const SL_REACT = new SLPoint();
export const SL_FILE_SYSTEM = new SLPoint();
export const SL_FFMPEG = new SLPoint();
export const SL_DATABASE = new SLPoint();
