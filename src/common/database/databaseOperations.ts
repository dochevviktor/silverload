import { Database } from 'better-sqlite3';
import { SLTable } from '../class/SLTable';

export const createTable = (it: SLTable) => {
  const query: string[] = [];

  query.push(`CREATE TABLE IF NOT EXISTS ${it.className} (`);
  it.columns.map((definition) => {
    query.push(definition.name);
    query.push(definition.type);
    if (definition.options?.pk) {
      query.push('PRIMARY KEY');
    } else {
      if (definition.options?.nullable) {
        query.push('NULL');
      } else {
        query.push('NOT NULL');
      }

      if (definition.options?.default !== undefined) {
        query.push(`DEFAULT ${definition.options.default}`);
      }
    }
    query.push(',');
  });
  query.pop();
  query.push(') WITHOUT ROWID;');

  return query.join(' ');
};

export const prepareSaveQuery = (table: SLTable): string => {
  const columns = [];
  const values = [];

  table.columnsWithValues().map((cols) => {
    columns.push(`${cols.definition.name}`);
    if (cols.definition.type === 'Boolean' || cols.definition.type === 'Numeric') {
      values.push(cols.value);
    } else {
      values.push(`'${cols.value}'`);
    }
  });

  return `REPLACE INTO ${table.className}(${columns.join(',')}) VALUES(${values.join(',')});`;
};

export const saveTable = (db: Database, tables: SLTable | SLTable[]): void => {
  if (db && tables) {
    if (Array.isArray(tables)) {
      db?.exec(tables.map((it) => prepareSaveQuery(it)).join(' '));
    } else {
      db?.exec(prepareSaveQuery(tables));
    }
  }
};

export const getAllFromTable = <T>(db: Database, table: SLTable<T>): T[] =>
  db?.prepare(`SELECT * FROM ${table.className}`)?.all();

export const prepareInsertIfExists = (table: SLTable): string => {
  const columns = [];
  const values = [];
  const exists = [];

  table.columnsWithValues().map((cols) => {
    let colValue;

    if (cols.definition.type === 'Boolean' || cols.definition.type === 'Numeric') {
      values.push(cols.value);
      colValue = cols.value;
    } else {
      colValue = `'${cols.value}'`;
    }
    columns.push(`${cols.definition.name}`);
    values.push(colValue);

    if (cols.definition.options?.pk) {
      exists.push(`${cols.definition.name} = ${colValue}`);
    }
  });

  return `INSERT INTO ${table.className}(${columns.join(',')}) SELECT ${values.join(',')}
  WHERE NOT EXISTS(select 1 from ${table.className} where ${exists.join(' AND ')});`;
};
