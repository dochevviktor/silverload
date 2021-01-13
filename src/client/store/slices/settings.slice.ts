import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SLSettings, { SLSettingEvent } from '../../../common/class/SLSettings';
import { SLDatabase } from '../../../common/constant/SLDatabase';

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
    loadSettings(state, action: PayloadAction<SLSettings[]>) {
      state.settings = action.payload;
    },
    saveSettings(state, action: PayloadAction<SLSettings[]>) {
      const webContentsId = ipcRenderer.sendSync(SLDatabase.GET_DATABASE_HANDLER_CONTENTS_ID);

      state.settings = action.payload;
      ipcRenderer.sendTo(webContentsId, SLSettingEvent.SAVE_SETTINGS, action.payload);
    },
  },
});

export const { toggleVisibility, toggleSetting, loadSettings, saveSettings } = SettingsModal.actions;

export default SettingsModal.reducer;
