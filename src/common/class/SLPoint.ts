import { WebContents } from 'electron';

export class SLPoint {
  private readonly webContentsList: WebContents[] = [];

  add(webContents: WebContents, excludeAll = false): void {
    this.webContentsList.push(webContents);
    if (!excludeAll) {
      SL_ALL.add(webContents, true);
    }
  }

  //Round robin load balancing
  get(): WebContents {
    const webContents = this.webContentsList.shift();

    this.webContentsList.push(webContents);

    return webContents;
  }

  getAll(): WebContents[] {
    return this.webContentsList;
  }

  contains(id: number): boolean {
    return this.webContentsList.find((it) => it.id === id) != null;
  }
}

// Special end point
export const SL_ALL = new SLPoint();

export const SL_REACT = new SLPoint();
export const SL_FILE_SYSTEM = new SLPoint();
export const SL_FFMPEG = new SLPoint();
export const SL_DATABASE = new SLPoint();
