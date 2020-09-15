import newId from '../function/SLRandom';
import SLImage from './SLImage';

export default class SLBasicTab {
  private _id: number;
  private _title: string;
  private _image: SLImage;

  constructor(title = 'New Tab') {
    this._id = newId();
    this._title = title;
    this._image = new SLImage();
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get image(): SLImage {
    return this._image;
  }

  set image(value: SLImage) {
    this._image = value;
  }
}
