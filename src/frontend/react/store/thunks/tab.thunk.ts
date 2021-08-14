import { AppThunk } from '../store';
import * as SLEvent from '../../../../common/class/SLEvent';
import { actions } from '../slices/tab.slice';
import { v4 as uuid } from 'uuid';
import SLTab from '../../../../common/class/SLTab';
import { SLFile } from '../../../../common/interface/SLFile';
import VALID_FILE_TYPES from '../../../../common/constant/SLImageFileTypes';
import { SLTabImageData } from '../../../../common/interface/SLTabImageData';

// Variables
const validateFileMimeType = (type: string) => VALID_FILE_TYPES.indexOf(type) !== -1;
const listeners: (() => void)[] = [];

// Helper functions
const loadImageData = (newTab: SLTab, dispatch: (arg) => void) => {
  if (newTab.path && !newTab.base64) {
    dispatch(actions.setTabLoading(newTab.id));
    SLEvent.LOAD_TAB_IMAGE.send({ tabId: newTab.id, path: newTab.path });
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

export const addTabListeners = (): AppThunk => async (dispatch) => {
  listeners.push(SLEvent.SEND_SL_FILES.on((files) => openNewTabs(files, (arg) => dispatch(arg))));
  listeners.push(SLEvent.LOAD_TAB_IMAGE.on((data) => dispatch(actions.loadTabImage(data))));
  listeners.push(SLEvent.LOAD_TAB_GIF_VIDEO.on((data) => dispatch(actions.loadTabImage(data))));
  listeners.push(SLEvent.SAVE_TABS.on(() => dispatch(actions.setIsSaving(false))));
  listeners.push(SLEvent.LOAD_TABS.on((args) => dispatch(actions.loadTabs(args))));
};

export const removeTabListeners = (): AppThunk => async () => {
  while (listeners.length) listeners.pop()();
};

export const loadFileArgs = (): AppThunk => async () => SLEvent.LOAD_FILE_ARGUMENTS.send();

export const requestImageData =
  (data: SLTabImageData): AppThunk =>
  async (dispatch) => {
    dispatch(actions.setTabLoading(data.tabId));
    SLEvent.LOAD_TAB_IMAGE.send(data);
  };

export const addNewTab =
  (tab: SLTab): AppThunk =>
  async (dispatch) => {
    dispatch(actions.addTab(tab));
    loadImageData(tab, (arg) => dispatch(arg));
  };

export const addNewActiveTab =
  (tab: SLTab = null): AppThunk =>
  async (dispatch) => {
    const newTab: SLTab = tab ? tab : { id: uuid(), title: 'New Tab' };

    dispatch(actions.addTab(newTab));
    dispatch(actions.setActiveTab(newTab));
    loadImageData(newTab, (arg) => dispatch(arg));
  };

// Database calls
export const loadTabs = (): AppThunk => async () => SLEvent.LOAD_TABS.send();

export const saveTabs =
  (tabs: SLTab[]): AppThunk =>
  async (dispatch) => {
    dispatch(actions.setIsSaving(true));
    SLEvent.SAVE_TABS.send(tabs);
  };

export const deleteTabs = (): AppThunk => async () => SLEvent.DELETE_TABS.send();
