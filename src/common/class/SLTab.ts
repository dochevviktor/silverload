import { Column, Entity, SLTable } from './SLTable';
import { Database } from 'better-sqlite3';
import { sha1 } from 'object-hash';
import { cleanUpDatabase, getAllFromTableOrdered, saveTable, truncateTable } from '../../database/databaseOperations';

export default interface SLTab {
  id: string;
  title: string;
  sequence?: number;
  path?: string;
  base64Image?: string;
  translateX?: number;
  translateY?: number;
  scaleX?: number;
  scaleY?: number;
  isLoading?: boolean;
}

export const loadTabs = (db: Database): SLTab[] => {
  console.log('Call to load tabs');

  return getAllFromTableOrdered<SLTab>(db, SLTabTable.prototype);
};

const convertToTableEntity = (it: SLTab) => {
  const tabTable = new SLTabTable(it);

  tabTable.imageHash = sha1(tabTable.base64Image);

  return tabTable;
};

export const saveTabs = (db: Database, tabs: SLTab[]): void => {
  console.log('Call to save tabs');
  if (db && tabs && tabs.length > 0) {
    const tableRows = tabs.filter((it) => it.base64Image).map((it) => convertToTableEntity(it));

    saveTable(db, tableRows);
  }
};

export const deleteTabs = (db: Database): void => {
  console.log('Call to delete tabs');
  if (db) {
    truncateTable(db, SLTabTable.prototype);
    cleanUpDatabase(db);
  }
};

@Entity
export class SLTabTable extends SLTable<SLTab> implements SLTab {
  @Column({ pk: true })
  id: string;

  @Column()
  title: string;

  @Column({ default: 0 })
  sequence: number;

  @Column({ nullable: true })
  path: string;

  @Column({ nullable: true })
  base64Image: string;

  @Column({ default: 0 })
  translateX: number;

  @Column({ default: 0 })
  translateY: number;

  @Column({ default: 1 })
  scaleX: number;

  @Column({ default: 1 })
  scaleY: number;

  @Column({ nullable: true })
  imageHash: string;
}
