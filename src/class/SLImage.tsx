import newId from '../function/SLRandom';

export default class SLImage {
  private _id: number;
  private _path: string | null;

  constructor(path?: string | null) {
    this._id = newId();
    this._path = path;
  }
}
