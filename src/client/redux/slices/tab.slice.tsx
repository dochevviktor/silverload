import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SLTab from '../../interface/SLTab';
import newId from '../../function/SLRandom';

interface SLTabListSlice {
  activeTab: SLTab;
  tabList: SLTab[];
}

const initialTabListState: SLTabListSlice = {
  activeTab: null,
  tabList: [],
};

export const TabListSlice = createSlice({
  name: 'TabListSlice',
  initialState: initialTabListState,
  reducers: {
    addTab(state, action: PayloadAction<SLTab>) {
      const newTab = action.payload ? action.payload : { id: newId(), title: 'New Tab' };

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
  },
});
