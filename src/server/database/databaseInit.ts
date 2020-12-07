import { Database } from 'better-sqlite3';
import { SLTable } from '../../common/class/SLTable';
import { SLSettingsTable } from '../../common/class/SLSettings';
import SLVersion, { SLVersionTable } from '../../common/class/SLVersion';
import { SLTabTable } from '../../common/class/SLTab';
import { SLSetting } from '../../common/constant/SLSetting';

const listOfEntities: SLTable[] = [SLSettingsTable.prototype, SLVersionTable.prototype, SLTabTable.prototype];

const createTable = (it: SLTable) => {
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

const createTables = (db: Database) => {
  const queries: string[] = [];

  listOfEntities.map((it) => queries.push(createTable(it)));
  db?.exec(queries.join(' '));
};

const prepareUpdateReplace = (table: SLTable): string => {
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

const prepareInsertIfExists = (table: SLTable): string => {
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

const iniVersion = (db: Database) => {
  const versionCheckStmt = db?.prepare(`SELECT * FROM ${SLVersionTable.prototype.className}`);
  const versionInDb: SLVersion[] = versionCheckStmt?.all() || [];
  const queries: string[] = [];

  versionInDb.map((ver) => {
    listOfEntities.map((table) => {
      if (table.className === ver.tableName && table.hash !== ver.tableHash) {
        new SLVersionTable({ tableName: table.className, tableHash: table.hash });
        queries.push(`DROP TABLE ${table.className};`);
        queries.push(createTable(table));
        queries.push(prepareUpdateReplace(new SLVersionTable({ tableName: table.className, tableHash: table.hash })));
      }
    });
    if (!listOfEntities.find((table) => table.className === ver.tableName)) {
      const verPkCol = SLVersionTable.prototype.columns.find((it) => it.options?.pk)?.name;

      queries.push(`DROP TABLE IF EXISTS ${ver.tableName};`);
      queries.push(`DELETE FROM ${SLVersionTable.prototype.className} where ${verPkCol} = '${ver.tableName}';`);
    }
  });

  listOfEntities.map((table) => {
    if (!versionInDb.find((ver) => ver.tableName === table.className)) {
      queries.push(prepareUpdateReplace(new SLVersionTable({ tableName: table.className, tableHash: table.hash })));
    }
  });

  if (queries.length > 0) {
    db?.exec(queries.join(' '));
  }
};

const initSettings = (db: Database) => {
  const queries: string[] = [];

  Object.keys(SLSetting).map((it) => {
    queries.push(prepareInsertIfExists(new SLSettingsTable({ title: it })));
  });
  db?.exec(queries.join(' '));
};

export const databaseInit = (db: Database): void => {
  createTables(db);
  iniVersion(db);
  initSettings(db);
};
