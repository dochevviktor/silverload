import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SLTab from '../../interface/SLTab';
import { v4 as uuid } from 'uuid';

interface SLTabListSlice {
  activeTab: SLTab;
  tabList: SLTab[];
}

interface SLImagePos {
  translateX: number;
  translateY: number;
}

const initialTabListState: SLTabListSlice = {
  activeTab: null,
  tabList: [],
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
    setActiveTabImage(state, action: PayloadAction<string>) {
      state.activeTab.base64Image = action.payload;
      state.tabList.find((it) => it.id === state.activeTab.id).base64Image = action.payload;
    },
    setActiveTabTitle(state, action: PayloadAction<string>) {
      state.activeTab.title = action.payload;
      state.tabList.find((it) => it.id === state.activeTab.id).title = action.payload;
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
  },
});

export const {
  addTab,
  addTabAndSetActive,
  removeTab,
  setActiveTab,
  setActiveTabImage,
  setActiveTabTitle,
  setImagePosition,
  resetImageSizeAndPos,
  changeImageSize,
} = TabListSlice.actions;

export default TabListSlice.reducer;
