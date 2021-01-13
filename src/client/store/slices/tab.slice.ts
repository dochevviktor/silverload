import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SLTab, { SLTabEvent } from '../../../common/class/SLTab';
import { v4 as uuid } from 'uuid';
import { SLDatabase } from '../../../common/constant/SLDatabase';

const { ipcRenderer } = window.require('electron');

interface SLTabListSlice {
  activeTab: SLTab;
  tabList: SLTab[];
}

interface SLImagePos {
  translateX: number;
  translateY: number;
}

interface SLImageData {
  title: string;
  path: string;
  base64Image: string;
}

const initialTabListState: SLTabListSlice = {
  activeTab: null,
  tabList: [],
};

const setData = (tab: SLTab, data: SLImageData) => {
  tab.title = data.title;
  tab.path = data.path;
  tab.base64Image = data.base64Image;
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

const addNewTab = (state, action: PayloadAction<SLTab>): SLTab => {
  const newTab: SLTab = action.payload ? action.payload : { id: uuid(), title: 'New Tab' };

  resetSizeAndPos(newTab);
  state.tabList.push(newTab);

  return newTab;
};

const TabListSlice = createSlice({
  name: 'TabListSlice',
  initialState: initialTabListState,
  reducers: {
    addTab(state, action: PayloadAction<SLTab>) {
      addNewTab(state, action);
    },
    addTabAndSetActive(state, action: PayloadAction<SLTab>) {
      state.activeTab = addNewTab(state, action);
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
      const webContentsId = ipcRenderer.sendSync(SLDatabase.GET_DATABASE_HANDLER_CONTENTS_ID);

      ipcRenderer.sendTo(webContentsId, SLTabEvent.SAVE_TABS, action.payload);
    },
    deleteTabs() {
      const webContentsId = ipcRenderer.sendSync(SLDatabase.GET_DATABASE_HANDLER_CONTENTS_ID);

      ipcRenderer.sendTo(webContentsId, SLTabEvent.DELETE_TABS);
    },
  },
});

export const {
  addTab,
  addTabAndSetActive,
  removeTab,
  setActiveTab,
  setActiveTabData,
  setImagePosition,
  resetImageSizeAndPos,
  changeImageSize,
  loadTabs,
  saveTabs,
  deleteTabs,
} = TabListSlice.actions;

export default TabListSlice.reducer;
