import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SLBasicTab from '../../class/SLBasicTab';

interface SLTabSlice {
  activeTab: SLBasicTab;
}

const initialState: SLTabSlice = {
  activeTab: null,
};

export const TabSlice = createSlice({
  name: 'TabSlice',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<SLBasicTab>) {
      state.activeTab = action.payload;
    },
    setActiveTabImage(state, action: PayloadAction<string>) {
      state.activeTab.image.base64 = action.payload;
    },
  },
});
