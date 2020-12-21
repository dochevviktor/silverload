import { Column, Entity, SLTable } from './SLTable';
import { Database } from 'better-sqlite3';
import { getAllFromTable, saveTable } from '../database/databaseOperations';

export enum SLSettingEvent {
  SAVE_SETTINGS = 'SAVE_SETTINGS',
  LOAD_SETTINGS = 'LOAD_SETTINGS',
}

export enum SLSetting {
  SAVE_ON_EXIT = 'Save tabs on application exit',
}

export default interface SLSettings {
  code: string;
  value?: string;
  flag?: boolean;
}

export const getSettings = (db: Database): SLSettings[] => getAllFromTable<SLSettings>(db, SLSettingsTable.prototype);

export const saveSettings = (db: Database, settings: SLSettings[]): string => {
  if (db && settings && settings.length > 0) {
    const tableRows = settings.map((it) => new SLSettingsTable(it));

    saveTable(db, tableRows);
  }

  return 'ok';
};

@Entity
export class SLSettingsTable extends SLTable<SLSettings> implements SLSettings {
  @Column({ pk: true })
  code: string;

  @Column({ nullable: true })
  value: string;

  @Column({ default: false })
  flag: boolean;
}
