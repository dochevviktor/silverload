import { Database } from 'better-sqlite3';
import DatabaseInitJson from './dbInit.json';
import { DatabaseInitType, Table } from './databaseInitType';

export const databaseInit = (db: Database): void => {
  const queries: string[] = [];
  const type: DatabaseInitType = DatabaseInitJson;

  type.tables.map((table: Table) => {
    const query: string[] = [];

    query.push(`CREATE TABLE IF NOT EXISTS main.${table.name}`);
    query.push('(');
    table.definitions.map((definition) => {
      query.push(definition.name);
      query.push(definition.type);
      if (definition.pk) {
        query.push('PRIMARY KEY');
      } else {
        if (definition.nullable) {
          query.push('NULL');
        } else {
          query.push('NOT NULL');
        }

        if (definition.default !== undefined) {
          query.push(`DEFAULT ${definition.default}`);
        }
      }
      query.push(',');
    });
    query.pop();
    query.push(') WITHOUT ROWID;');
    queries.push(query.join(' '));
  });
  db?.exec(queries.join(' '));
};
