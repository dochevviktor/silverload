import { AppThunk } from '../store';
import * as SLEvent from '../../../common/class/SLEvent';
import { actions } from '../slices/tab.slice';
import { v4 as uuid } from 'uuid';
import SLTab from '../../../common/class/SLTab';
import { SLFile } from '../../../common/interface/SLFile';
import VALID_FILE_TYPES from '../../../common/constant/SLImageFileTypes';
import { SLTabImageData } from '../../../common/interface/SLTabImageData';
import bytesToBase64 from '../../../common/constant/SLBase64Converters';
import { createFFmpeg } from '@ffmpeg/ffmpeg';

// Variables
const databaseHandlerId = SLEvent.GET_DATABASE_HANDLER_CONTENTS_ID.sendSync(window.ipcRenderer);
const fsHandlerId = SLEvent.GET_FS_HANDLER_CONTENTS_ID.sendSync(window.ipcRenderer);
const validateFileMimeType = (type: string) => VALID_FILE_TYPES.indexOf(type) !== -1;
const listeners: (() => void)[] = [];
const ratioPrint = ({ ratio }) => console.log(`Progress: ${ratio * 100.0}%`);
const ffmpeg = createFFmpeg({ progress: ratioPrint, corePath: './ffmpeg-core.js' });

// Helper functions
const loadImageData = (newTab: SLTab, dispatch: (arg) => void) => {
  if (newTab.path && !newTab.base64Image) {
    dispatch(actions.setTabLoading(newTab.id));
    SLEvent.LOAD_TAB_IMAGE.sendTo(window.ipcRenderer, fsHandlerId, { tabId: newTab.id, path: newTab.path });
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

const processVideo = async (tabImageData: SLTabImageData, dispatch) => {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  if (tabImageData?.rawImage) {
    await ffmpeg.FS('writeFile', 'file.gif', tabImageData.rawImage);

    await ffmpeg.run(
      '-i',
      'file.gif',
      '-movflags',
      'faststart',
      '-crf',
      '23',
      '-preset',
      'ultrafast',
      '-pix_fmt',
      'yuv420p',
      '-vf',
      'scale=trunc(iw/2)*2:trunc(ih/2)*2',
      'file.mp4'
    );

    const data = await ffmpeg.FS('readFile', 'file.mp4');

    tabImageData.base64 = `data:video/mp4;base64,${bytesToBase64(data)}`;
    dispatch(actions.loadTabImage(tabImageData));

    // cleanup
    await ffmpeg.FS('unlink', 'file.mp4');
    await ffmpeg.FS('unlink', 'file.gif');
  }
};

// File system calls
export const addListeners = (): AppThunk => async (dispatch) => {
  listeners.push(SLEvent.SEND_SL_FILES.on(window.ipcRenderer, (files) => openNewTabs(files, (arg) => dispatch(arg))));
  listeners.push(SLEvent.LOAD_TAB_IMAGE.on(window.ipcRenderer, (data) => dispatch(actions.loadTabImage(data))));
  listeners.push(SLEvent.LOAD_TAB_GIF_VIDEO.on(window.ipcRenderer, (data) => processVideo(data, dispatch)));
};

export const removeListeners = (): AppThunk => async () => {
  while (listeners.length) listeners.pop()();
};

export const loadFileArgs = (): AppThunk => async () => {
  SLEvent.GET_FILE_ARGUMENTS.sendTo(window.ipcRenderer, fsHandlerId);
};

export const requestImageData = (data: SLTabImageData): AppThunk => async (dispatch) => {
  dispatch(actions.setTabLoading(data.tabId));
  SLEvent.LOAD_TAB_IMAGE.sendTo(window.ipcRenderer, fsHandlerId, data);
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
  SLEvent.LOAD_TABS.sendTo(window.ipcRenderer, databaseHandlerId);
  SLEvent.LOAD_TABS.once(window.ipcRenderer, (args) => dispatch(actions.loadTabs(args)));
};

export const save = (tabs: SLTab[]): AppThunk => async (dispatch) => {
  dispatch(actions.setIsSaving(true));
  SLEvent.SAVE_TABS.sendTo(window.ipcRenderer, databaseHandlerId, tabs);
  SLEvent.SAVE_TABS.once(window.ipcRenderer, () => dispatch(actions.setIsSaving(false)));
};

export const deleteTabs = (): AppThunk => async () => {
  SLEvent.DELETE_TABS.sendTo(window.ipcRenderer, databaseHandlerId);
};
