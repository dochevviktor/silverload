import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SLSettings, { SLSettingEvent } from '../../../common/class/SLSettings';

const { ipcRenderer } = window.require('electron');

interface SettingsModal {
  isVisible: boolean;
  settings: SLSettings[];
}

const initialVisibilityState: SettingsModal = {
  isVisible: false,
  settings: [],
};

const SettingsModal = createSlice({
  name: 'SettingsModal',
  initialState: initialVisibilityState,
  reducers: {
    toggleVisibility(state) {
      state.isVisible = !state.isVisible;
    },
    toggleSetting(state, action: PayloadAction<number>) {
      state.settings[action.payload].flag = !state.settings[action.payload].flag;
    },
    loadSettings(state) {
      state.settings = ipcRenderer.sendSync(SLSettingEvent.LOAD);
    },
    saveSettings(state, action: PayloadAction<SLSettings[]>) {
      state.settings = action.payload;
      ipcRenderer.sendSync(SLSettingEvent.SAVE, action.payload);
    },
  },
});

export const { toggleVisibility, toggleSetting, loadSettings, saveSettings } = SettingsModal.actions;

export default SettingsModal.reducer;
