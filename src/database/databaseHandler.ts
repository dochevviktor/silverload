import Database from 'better-sqlite3';
import { databaseInit } from './databaseInit';
import { SLDatabase } from '../common/constant/SLDatabase';
import { getSettings, saveSettings, SLSettingEvent } from '../common/class/SLSettings';
import { deleteTabs, getTabs, saveTabs, SLTabEvent } from '../common/class/SLTab';

const { ipcRenderer } = require('electron');

let db = null;

// SL Settings
ipcRenderer.on(SLSettingEvent.SAVE_SETTINGS, (event, arg) => {
  console.log('Call to save settings');
  ipcRenderer.sendTo(event.senderId, SLSettingEvent.SAVE_SETTINGS, saveSettings(db, arg));
});

ipcRenderer.on(SLSettingEvent.LOAD_SETTINGS, (event) => {
  console.log('Call to load settings');
  ipcRenderer.sendTo(event.senderId, SLSettingEvent.LOAD_SETTINGS, getSettings(db));
});

// SL Tabs
ipcRenderer.on(SLTabEvent.SAVE_TABS, (event, arg) => {
  console.log('Call to save tabs');
  ipcRenderer.sendTo(event.senderId, SLTabEvent.SAVE_TABS, saveTabs(db, arg));
});
ipcRenderer.on(SLTabEvent.LOAD_TABS, (event) => {
  console.log('Call to load tabs');
  ipcRenderer.sendTo(event.senderId, SLTabEvent.LOAD_TABS, getTabs(db));
});
ipcRenderer.on(SLTabEvent.DELETE_TABS, () => deleteTabs(db));

try {
  db = new Database(ipcRenderer.sendSync(SLDatabase.GET_DB_PATH));
  databaseInit(db);
} catch (e) {
  console.log(e);
}
