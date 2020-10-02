import newId from '../function/SLRandom';

export default class SLImage {
  private _id: number;
  private _base64: string;

  constructor() {
    this._id = newId();
    this._base64 = '';
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get base64(): string | null {
    return this._base64;
  }

  set base64(value: string | null) {
    this._base64 = value;
  }
}
