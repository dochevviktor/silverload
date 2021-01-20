import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SLSettings, { SLSettingEvent } from '../../../common/class/SLSettings';
import { SLEvent } from '../../../common/constant/SLEvent';

const { ipcRenderer } = window.require('electron');

interface SettingsModal {
  isVisible: boolean;
  isSaving: boolean;
  settings: SLSettings[];
}

const initialVisibilityState: SettingsModal = {
  isVisible: false,
  isSaving: false,
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
    loadSettings(state, { payload }: PayloadAction<SLSettings[]>) {
      state.settings = payload;
    },
    saveSettings(state, action: PayloadAction<SLSettings[]>) {
      state.isSaving = true;
      const webContentsId = ipcRenderer.sendSync(SLEvent.GET_DATABASE_HANDLER_CONTENTS_ID);

      state.settings = action.payload;
      ipcRenderer.sendTo(webContentsId, SLSettingEvent.SAVE_SETTINGS, action.payload);
      state.isVisible = !state.isVisible;
    },
    saveSettingsDone(state) {
      state.isSaving = false;
    },
  },
});

export const { toggleVisibility, toggleSetting, saveSettingsDone, loadSettings, saveSettings } = SettingsModal.actions;

export default SettingsModal.reducer;
