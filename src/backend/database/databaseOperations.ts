import { Database } from 'better-sqlite3';
import { SLTable } from '../../common/class/SLTable';

export const createTableQuery = (it: SLTable): string => {
  const query: string[] = [];

  query.push(`CREATE TABLE IF NOT EXISTS ${it.className} (`);
  it.columns.map((definition) => {
    query.push(definition.name);
    query.push(columnType[definition.type] || columnType['default']);
    if (definition.options?.pk) {
      query.push('PRIMARY KEY');
    } else {
      if (definition.options?.nullable) {
        query.push('NULL');
      } else {
        query.push('NOT NULL');
      }

      if (definition.options?.unique) {
        query.push('UNIQUE');
      }

      if (definition.options?.default !== undefined) {
        if (typeof definition.options.default === 'string') {
          query.push(`DEFAULT '${definition.options.default}'`);
        } else {
          query.push(`DEFAULT ${definition.options.default}`);
        }
      }
    }
    query.push(',');
  });
  query.pop();
  query.push(') WITHOUT ROWID;');

  return query.join(' ');
};

const columnType = {
  Boolean: 'NUMERIC',
  Number: 'NUMERIC',
  String: 'TEXT',
  default: 'TEXT',
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

export const truncateTable = (db: Database, table: SLTable): void => {
  db?.prepare(`DELETE FROM ${table.className}`)?.run();
};

export const cleanUpDatabase = (db: Database): void => {
  db?.prepare('VACUUM')?.run();
};

export const saveTable = (db: Database, tables: SLTable | SLTable[]): void => {
  if (db && tables) {
    db.transaction(() => {
      if (Array.isArray(tables)) {
        tables.map((it) => db?.prepare(prepareSaveQuery(it))?.run());
      } else {
        db?.prepare(prepareSaveQuery(tables))?.run();
      }
    })();
  }
};

export const getAllFromTableOrdered = <T>(db: Database, table: SLTable<T>): T[] =>
  db?.prepare(`SELECT * FROM ${table.className} ORDER BY sequence`)?.all();

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
