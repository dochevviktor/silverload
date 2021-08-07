import Database from 'better-sqlite3';
import { ipcRenderer } from 'electron';
import { databaseInit } from './databaseInit';
import * as SLEvent from '../common/class/SLEvent';
import { getSettings, saveSettings } from '../common/class/SLSettings';
import { deleteTabs, loadTabs, saveTabs } from '../common/class/SLTab';

window.ipcRenderer = ipcRenderer;

let db = null;

// SL Settings
SLEvent.SAVE_SETTINGS.sendBack((arg) => saveSettings(db, arg));
SLEvent.LOAD_SETTINGS.sendBack(() => getSettings(db));

// SL Tabs
SLEvent.SAVE_TABS.sendBack((arg) => saveTabs(db, arg));
SLEvent.LOAD_TABS.sendBack(() => loadTabs(db));
SLEvent.DELETE_TABS.on(() => deleteTabs(db));

const bootstrapDatabase = (dbPath: string) => {
  try {
    db = new Database(dbPath);
    databaseInit(db);
  } catch (e) {
    console.error(e);
  }
};

SLEvent.GET_DB_PATH.once(bootstrapDatabase);
SLEvent.GET_DB_PATH.send();
