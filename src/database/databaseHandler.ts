import Database from 'better-sqlite3';
import { databaseInit } from './databaseInit';
import { SLDatabase } from '../common/constant/SLDatabase';
import { getSettings, saveSettings, SLSettingEvent } from '../common/class/SLSettings';
import { deleteTabs, getTabs, saveTabs, SLTabEvent } from '../common/class/SLTab';

const { ipcRenderer } = require('electron');

let db = null;

ipcRenderer.on(SLSettingEvent.SAVE_SETTINGS, (event, arg) => saveSettings(db, arg));
ipcRenderer.on(SLSettingEvent.LOAD_SETTINGS, (event) =>
  ipcRenderer.sendTo(event.senderId, SLSettingEvent.LOAD_SETTINGS, getSettings(db))
);

ipcRenderer.on(SLTabEvent.DELETE_TABS, () => deleteTabs(db));
ipcRenderer.on(SLTabEvent.SAVE_TABS, (event, arg) => saveTabs(db, arg));
ipcRenderer.on(SLTabEvent.LOAD_TABS, (event) => ipcRenderer.sendTo(event.senderId, SLTabEvent.LOAD_TABS, getTabs(db)));

try {
  db = new Database(ipcRenderer.sendSync(SLDatabase.GET_DB_PATH));
  databaseInit(db);
} catch (e) {
  console.log(e);
}
