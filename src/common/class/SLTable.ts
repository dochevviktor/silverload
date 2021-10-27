import 'reflect-metadata';
import Dexie, { Table } from 'dexie';

const metadataKey = 'columns';

export const Column: PropertyDecorator = (target, name: string) => {
  const columns: string[] = Reflect.getOwnMetadata(metadataKey, target) || [];

  if (!columns.find((it) => it === name)) {
    columns.push(name);
  }
  Reflect.defineMetadata(metadataKey, columns, target);
};

export const Entity: ClassDecorator = (target) => {
  const columns = Reflect.getOwnMetadata(metadataKey, target.prototype) || [];

  target.prototype.table = new (class extends Dexie {
    slTable: Dexie.Table<unknown, number>;
    constructor() {
      super(target.name);
      this.version(2).stores({
        slTable: columns.join(','),
      });
    }
  })().slTable;
};

export abstract class SLTable<T = unknown> {
  table: Table<T>;
}
