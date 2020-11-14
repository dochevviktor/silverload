import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SLTab from '../../interface/SLTab';
import newId from '../../function/SLRandom';
import SLImagePos from '../../interface/SLImagePos';

interface SLTabListSlice {
  activeTab: SLTab;
  tabList: SLTab[];
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

const resetSize = (tab: SLTab) => {
  tab.scaleX = 1;
  tab.scaleY = 1;
};

export const TabListSlice = createSlice({
  name: 'TabListSlice',
  initialState: initialTabListState,
  reducers: {
    addTab(state, action: PayloadAction<SLTab>) {
      const newTab = action.payload
        ? action.payload
        : {
            id: newId(),
            title: 'New Tab',
            translateX: 0,
            translateY: 0,
            scaleX: 1,
            scaleY: 1,
          };

      state.tabList.push(newTab);
      state.activeTab = newTab;
    },
    removeTab(state, action: PayloadAction<number>) {
      const tabIndex = action.payload;

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
    resetImageSize(state) {
      resetSize(state.activeTab);
      resetSize(state.tabList.find((it) => it.id === state.activeTab.id));
    },
    increaseImageSize(state) {
      setSize(state.activeTab, 1.1);
      setSize(
        state.tabList.find((it) => it.id === state.activeTab.id),
        1.1
      );
    },
    decreaseImageSize(state) {
      setSize(state.activeTab, 0.9);
      setSize(
        state.tabList.find((it) => it.id === state.activeTab.id),
        0.9
      );
    },
  },
});
