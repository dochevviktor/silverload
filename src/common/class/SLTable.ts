import 'reflect-metadata';
import { sha1 } from 'object-hash';

const metadataKey = 'columns';

export interface ColumnOptions {
  pk?: boolean;
  nullable?: boolean;
  unique?: boolean;
  default?: unknown;
}

export interface ColumnDefinition {
  name: string;
  type: string;
  options: ColumnOptions;
}

export interface ColumnWithValue {
  definition: ColumnDefinition;
  value: unknown;
}

export const Column = (options: ColumnOptions = {}): PropertyDecorator => (target, name: string) => {
  const columns: ColumnDefinition[] = Reflect.getOwnMetadata(metadataKey, target) || [];
  const { name: type } = Reflect.getOwnMetadata('design:type', target, name);

  if (!columns.find((it) => it.name === name)) {
    columns.push({ name, type, options });
  }
  Reflect.defineMetadata(metadataKey, columns, target);
};

export const Entity: ClassDecorator = (target) => {
  const columns = Reflect.getOwnMetadata(metadataKey, target.prototype) || [];

  target.prototype.className = target.name;
  target.prototype.columns = columns;
  target.prototype.hash = sha1(target.prototype.columns);
};

export abstract class SLTable<T = unknown> {
  className: string;
  hash: string;
  columns: ColumnDefinition[];
  columnsWithValues = (): ColumnWithValue[] =>
    this.columns
      .filter((it) => this[it.name] !== undefined)
      .map((it): ColumnWithValue => ({ definition: it, value: this[it.name] }));

  constructor(a: T) {
    this.columns.map((it) => (this[it.name] = a[it.name]));
  }
}
