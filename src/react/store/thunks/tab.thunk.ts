import { AppThunk } from '../store';
import * as SLEvent from '../../../common/class/SLEvent';
import { actions } from '../slices/tab.slice';
import { v4 as uuid } from 'uuid';
import SLTab from '../../../common/class/SLTab';
import { SLFile } from '../../../common/interface/SLFile';
import VALID_FILE_TYPES from '../../../common/constant/SLImageFileTypes';
import { SLTabImageData } from '../../../common/interface/SLTabImageData';

const { ipcRenderer } = window.require('electron');

// Variables
const databaseHandlerId = SLEvent.GET_DATABASE_HANDLER_CONTENTS_ID.sendSync(ipcRenderer);
const fsHandlerId = SLEvent.GET_FS_HANDLER_CONTENTS_ID.sendSync(ipcRenderer);
const validateFileMimeType = (type: string) => VALID_FILE_TYPES.indexOf(type) !== -1;
const listeners: (() => void)[] = [];

// Helper functions
const loadImageData = (newTab: SLTab, dispatch: (arg) => void) => {
  if (newTab.path && !newTab.base64Image) {
    dispatch(actions.setTabLoading(newTab.id));
    SLEvent.LOAD_TAB_IMAGE.sendTo(ipcRenderer, fsHandlerId, { tabId: newTab.id, path: newTab.path });
  }
};

const openNewTabs = (fileList: SLFile[], dispatch: (arg) => void) => {
  const { length, 0: first, ...otherFiles } = fileList;

  if (!first || !validateFileMimeType(first.mimeType)) return;

  dispatch(addNewActiveTab({ id: uuid(), title: first.name, path: first.path }));

  if (length === 1) return;

  Object.values(otherFiles)
    .filter((it) => validateFileMimeType(it.mimeType))
    .map((it) => dispatch(addNewTab({ id: uuid(), title: it.name, path: it.path })));
};

// File system calls
export const addListeners = (): AppThunk => async (dispatch) => {
  listeners.push(SLEvent.SEND_SL_FILES.on(ipcRenderer, (files) => openNewTabs(files, (arg) => dispatch(arg))));
  listeners.push(SLEvent.LOAD_TAB_IMAGE.on(ipcRenderer, (data) => dispatch(actions.loadTabImage(data))));
};

export const removeListeners = (): AppThunk => async () => {
  while (listeners.length) listeners.pop()();
};

export const loadFileArgs = (): AppThunk => async () => {
  SLEvent.GET_FILE_ARGUMENTS.sendTo(ipcRenderer, fsHandlerId);
};

export const requestImageData = (data: SLTabImageData): AppThunk => async (dispatch) => {
  dispatch(actions.setTabLoading(data.tabId));
  SLEvent.LOAD_TAB_IMAGE.sendTo(ipcRenderer, fsHandlerId, data);
};

export const addNewTab = (tab: SLTab): AppThunk => async (dispatch) => {
  dispatch(actions.addTab(tab));
  loadImageData(tab, (arg) => dispatch(arg));
};

export const addNewActiveTab = (tab: SLTab = null): AppThunk => async (dispatch) => {
  const newTab: SLTab = tab ? tab : { id: uuid(), title: 'New Tab' };

  dispatch(actions.addTab(newTab));
  dispatch(actions.setActiveTab(newTab));
  loadImageData(newTab, (arg) => dispatch(arg));
};

// Database calls
export const load = (): AppThunk => async (dispatch) => {
  SLEvent.LOAD_TABS.sendTo(ipcRenderer, databaseHandlerId);
  SLEvent.LOAD_TABS.once(ipcRenderer, (args) => dispatch(actions.loadTabs(args)));
};

export const save = (tabs: SLTab[]): AppThunk => async (dispatch) => {
  dispatch(actions.setIsSaving(true));
  SLEvent.SAVE_TABS.sendTo(ipcRenderer, databaseHandlerId, tabs);
  SLEvent.SAVE_TABS.once(ipcRenderer, () => dispatch(actions.setIsSaving(false)));
};

export const deleteTabs = (): AppThunk => async () => {
  SLEvent.DELETE_TABS.sendTo(ipcRenderer, databaseHandlerId);
};
