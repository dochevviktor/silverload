import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SLTab from '../../../common/class/SLTab';
import { v4 as uuid } from 'uuid';
import * as SLEvent from '../../../common/class/SLEvent';
import { SLTabImageData } from '../../../common/interface/SLTabImageData';

const { ipcRenderer } = window.require('electron');

interface SLTabListSlice {
  activeTab: SLTab;
  isSaving: boolean;
  databaseHandlerId: number;
  fsHandlerId: number;
  tabList: SLTab[];
}

interface SLImagePos {
  translateX: number;
  translateY: number;
}

interface SLImageData {
  title: string;
  path: string;
}

const initialTabListState: SLTabListSlice = {
  activeTab: null,
  isSaving: false,
  databaseHandlerId: SLEvent.GET_DATABASE_HANDLER_CONTENTS_ID.sendSync(ipcRenderer),
  fsHandlerId: SLEvent.GET_FS_HANDLER_CONTENTS_ID.sendSync(ipcRenderer),
  tabList: [],
};

const setData = (tab: SLTab, data: SLImageData) => {
  tab.title = data.title;
  tab.path = data.path;
  resetSizeAndPos(tab);
};

const setPosition = (tab: SLTab, position: SLImagePos) => {
  tab.translateX = position.translateX;
  tab.translateY = position.translateY;
};

const setSize = (tab: SLTab, multiplier: number) => {
  tab.scaleX *= multiplier;
  tab.scaleY *= multiplier;
};

const resetSizeAndPos = (tab: SLTab) => {
  tab.translateX = 0;
  tab.translateY = 0;
  tab.scaleX = 1;
  tab.scaleY = 1;
};

const addNewTab = (state, tab: SLTab): SLTab => {
  const newTab: SLTab = tab ? tab : { id: uuid(), title: 'New Tab' };

  resetSizeAndPos(newTab);
  state.tabList.push(newTab);

  return newTab;
};

const TabListSlice = createSlice({
  name: 'TabListSlice',
  initialState: initialTabListState,
  reducers: {
    addTab(state, action: PayloadAction<SLTab>) {
      const newTab: SLTab = addNewTab(state, action.payload);

      if (newTab.path && !newTab.base64Image) {
        SLEvent.LOAD_TAB_IMAGE.sendTo(ipcRenderer, state.fsHandlerId, { tabId: newTab.id, path: newTab.path });
      }
    },
    addTabAndSetActive(state, action: PayloadAction<SLTab>) {
      const newTab: SLTab = addNewTab(state, action.payload);

      state.activeTab = newTab;

      if (newTab.path && !newTab.base64Image) {
        SLEvent.LOAD_TAB_IMAGE.sendTo(ipcRenderer, state.fsHandlerId, { tabId: newTab.id, path: newTab.path });
      }
    },
    requestLoadTabImage(state, { payload: tabImageData }: PayloadAction<SLTabImageData>) {
      SLEvent.LOAD_TAB_IMAGE.sendTo(ipcRenderer, state.fsHandlerId, tabImageData);
    },
    loadTabImage(state, { payload: tabImageData }: PayloadAction<SLTabImageData>) {
      if (state.activeTab.id === tabImageData.tabId) {
        state.activeTab.base64Image = tabImageData.base64;
      }
      state.tabList.find((it) => it.id === tabImageData.tabId).base64Image = tabImageData.base64;
    },
    removeTab(state, action: PayloadAction<number>) {
      const tabIndex = action.payload;

      state.tabList[tabIndex].base64Image = null;
      state.tabList[tabIndex].path = null;
      state.tabList.splice(tabIndex, 1);

      const nextPos = state.tabList.length - 1 >= tabIndex ? tabIndex : state.tabList.length - 1;

      const nextActiveTab = nextPos >= 0 ? state.tabList[nextPos] : null;

      if (nextActiveTab) {
        state.activeTab = nextActiveTab;
      }
    },
    setActiveTab(state, action: PayloadAction<SLTab>) {
      state.activeTab = action.payload;
    },
    setActiveTabData(state, action: PayloadAction<SLImageData>) {
      setData(state.activeTab, action.payload);
      setData(
        state.tabList.find((it) => it.id === state.activeTab.id),
        action.payload
      );
    },
    setImagePosition(state, action: PayloadAction<SLImagePos>) {
      setPosition(state.activeTab, action.payload);
      setPosition(
        state.tabList.find((it) => it.id === state.activeTab.id),
        action.payload
      );
    },
    resetImageSizeAndPos(state) {
      resetSizeAndPos(state.activeTab);
      resetSizeAndPos(state.tabList.find((it) => it.id === state.activeTab.id));
    },
    changeImageSize(state, action: PayloadAction<number>) {
      setSize(state.activeTab, action.payload);
      setSize(
        state.tabList.find((it) => it.id === state.activeTab.id),
        action.payload
      );
    },
    loadTabs(state, action: PayloadAction<SLTab[]>) {
      const loadedIds: string[] = state.tabList.map((it) => it.id);

      action.payload.filter((it) => !loadedIds.find((id) => id === it.id)).forEach((it) => state.tabList.push(it));

      if (state.tabList.length > 0) {
        state.activeTab = state.tabList[0];
      }
    },
    saveTabs(state, action: PayloadAction<SLTab[]>) {
      state.isSaving = true;
      SLEvent.SAVE_TABS.sendTo(ipcRenderer, state.databaseHandlerId, action.payload);
    },
    saveTabsDone(state) {
      state.isSaving = false;
    },
    deleteTabs(state) {
      SLEvent.DELETE_TABS.sendTo(ipcRenderer, state.databaseHandlerId);
    },
  },
});

export const {
  addTab,
  addTabAndSetActive,
  loadTabImage,
  requestLoadTabImage,
  removeTab,
  setActiveTab,
  setActiveTabData,
  setImagePosition,
  resetImageSizeAndPos,
  changeImageSize,
  loadTabs,
  saveTabs,
  saveTabsDone,
  deleteTabs,
} = TabListSlice.actions;

export default TabListSlice.reducer;
