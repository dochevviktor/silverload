import newId from '../function/SLRandom';

export default class SLImage {
  private _id: number;
  private _path: string | null;

  constructor(path?: string | null) {
    this._id = newId();
    this._path = path;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get path(): string | null {
    return this._path;
  }

  set path(value: string | null) {
    this._path = value;
  }
}
