import { Column, Entity, SLTable } from './SLTable';
import { Database } from 'better-sqlite3';
import { sha1 } from 'object-hash';
import { getAllFromTable, saveTable, truncateTable } from '../../database/databaseOperations';

export default interface SLTab {
  id: string;
  title: string;
  path?: string;
  base64Image?: string;
  translateX?: number;
  translateY?: number;
  scaleX?: number;
  scaleY?: number;
}

export enum SLTabEvent {
  SAVE_TABS = 'SAVE_TABS',
  LOAD_TABS = 'LOAD_TABS',
  DELETE_TABS = 'DELETE_TABS',
}

export const getTabs = (db: Database): SLTab[] => getAllFromTable<SLTab>(db, SLTabTable.prototype);

const convertToTableEntity = (it: SLTab) => {
  const tabTable = new SLTabTable(it);

  tabTable.imageHash = sha1(tabTable.base64Image);

  return tabTable;
};

export const saveTabs = (db: Database, tabs: SLTab[]): string => {
  if (db && tabs && tabs.length > 0) {
    const tableRows = tabs.filter((it) => it.base64Image).map((it) => convertToTableEntity(it));

    saveTable(db, tableRows);
  }

  return 'ok';
};

export const deleteTabs = (db: Database): string => {
  if (db) {
    truncateTable(db, SLTabTable.prototype);
  }

  return 'ok';
};

@Entity
export class SLTabTable extends SLTable<SLTab> implements SLTab {
  @Column({ pk: true })
  id: string;

  @Column()
  title: string;

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
