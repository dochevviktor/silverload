import { SLTab } from '../interface/Common';

class SLBasicTab implements SLTab {
  private _id: number;
  private _title: string;

  constructor(id?: number, title?: string) {
    this._id = id || 1;
    this._title = title || 'New Tab';
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
}

export default SLBasicTab;
