import { Column, Entity, SLTable } from './SLTable';
import { Database } from 'better-sqlite3';
import { getAllFromTableOrdered, saveTable } from '../../database/databaseOperations';

export enum SLSetting {
  SAVE_ON_EXIT = 'Save tabs on application exit',
}

export default interface SLSettings {
  code: string;
  sequence?: number;
  value?: string;
  flag?: boolean;
}

export const getSettings = (db: Database): SLSettings[] => {
  console.log('Call to load settings');

  return getAllFromTableOrdered<SLSettings>(db, SLSettingsTable.prototype);
};

export const saveSettings = (db: Database, settings: SLSettings[]): SLSettings[] => {
  console.log('Call to save settings');
  if (db && settings && settings.length > 0) {
    const tableRows = settings.map((it) => new SLSettingsTable(it));

    saveTable(db, tableRows);
  }

  return [];
};

@Entity
export class SLSettingsTable extends SLTable<SLSettings> implements SLSettings {
  @Column({ pk: true })
  code: string;

  @Column({ default: 0 })
  sequence: number;

  @Column({ nullable: true })
  value: string;

  @Column({ default: false })
  flag: boolean;
}
