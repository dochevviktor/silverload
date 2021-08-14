import { Database } from 'better-sqlite3';
import { SLTable } from '../../common/class/SLTable';
import { SLSettingsTable } from '../../common/class/SLSettings';
import SLVersion, { SLVersionTable } from '../../common/class/SLVersion';
import { SLTabTable } from '../../common/class/SLTab';
import { SLSetting } from '../../common/class/SLSettings';
import { createTableQuery, prepareInsertIfExists, prepareSaveQuery } from './databaseOperations';

const listOfEntities: SLTable[] = [SLSettingsTable.prototype, SLVersionTable.prototype, SLTabTable.prototype];

const iniVersion = (db: Database) => {
  console.log('Checking changes in table structure');
  const versionCheckStmt = db?.prepare(`SELECT * FROM ${SLVersionTable.prototype.className}`);
  const versionInDb: SLVersion[] = versionCheckStmt?.all() || [];
  const queries: string[] = [];

  versionInDb.map((ver) => {
    listOfEntities.map((table) => {
      if (table.className === ver.tableName && table.hash !== ver.tableHash) {
        console.log('Change detected - rebuilding table:', ver.tableName);
        new SLVersionTable({ tableName: table.className, tableHash: table.hash });
        queries.push(`DROP TABLE ${table.className};`);
        queries.push(createTableQuery(table));
        queries.push(prepareSaveQuery(new SLVersionTable({ tableName: table.className, tableHash: table.hash })));
      }
    });
    if (!listOfEntities.find((table) => table.className === ver.tableName)) {
      console.log('Change detected - removing table:', ver.tableName);
      const verPkCol = SLVersionTable.prototype.columns.find((it) => it.options?.pk)?.name;

      queries.push(`DROP TABLE IF EXISTS ${ver.tableName};`);
      queries.push(`DELETE FROM ${SLVersionTable.prototype.className} where ${verPkCol} = '${ver.tableName}';`);
    }
  });

  listOfEntities.map((table) => {
    if (!versionInDb.find((ver) => ver.tableName === table.className)) {
      console.log('Change detected - adding table:', table.className);
      queries.push(prepareSaveQuery(new SLVersionTable({ tableName: table.className, tableHash: table.hash })));
    }
  });

  if (queries.length > 0) {
    db?.exec(queries.join(' '));
  }
};

const initSettings = (db: Database) => {
  const queries: string[] = [];

  Object.keys(SLSetting).map((it, key) => {
    queries.push(prepareInsertIfExists(new SLSettingsTable({ code: it, sequence: key })));
  });
  db?.exec(queries.join(' '));
};

const initTables = (db: Database) => {
  const queries: string[] = [];

  listOfEntities.map((it) => queries.push(createTableQuery(it)));
  db?.exec(queries.join(' '));
};

export const databaseInit = (db: Database): void => {
  initTables(db);
  iniVersion(db);
  initSettings(db);
};
