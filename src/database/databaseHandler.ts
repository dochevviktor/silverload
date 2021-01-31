import Database from 'better-sqlite3';
import { ipcRenderer } from 'electron';
import { databaseInit } from './databaseInit';
import * as SLEvent from '../common/class/SLEvent';
import { getSettings, saveSettings } from '../common/class/SLSettings';
import { deleteTabs, loadTabs, saveTabs } from '../common/class/SLTab';

let db = null;

// SL Settings
SLEvent.SAVE_SETTINGS.sendBack(ipcRenderer, (arg) => saveSettings(db, arg));
SLEvent.LOAD_SETTINGS.sendBack(ipcRenderer, () => getSettings(db));

// SL Tabs
SLEvent.SAVE_TABS.sendBack(ipcRenderer, (arg) => saveTabs(db, arg));
SLEvent.LOAD_TABS.sendBack(ipcRenderer, () => loadTabs(db));
SLEvent.DELETE_TABS.on(ipcRenderer, () => deleteTabs(db));

try {
  db = new Database(SLEvent.GET_DB_PATH.sendSync(ipcRenderer));
  databaseInit(db);
} catch (e) {
  console.error(e);
}
