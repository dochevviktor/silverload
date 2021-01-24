import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SLSettings from '../../../common/class/SLSettings';
import * as SLEvent from '../../../common/class/SLEvent';

const { ipcRenderer } = window.require('electron');

interface SettingsModal {
  isVisible: boolean;
  isSaving: boolean;
  databaseHandlerId: number;
  settings: SLSettings[];
}

const initialVisibilityState: SettingsModal = {
  isVisible: false,
  isSaving: false,
  databaseHandlerId: SLEvent.GET_DATABASE_HANDLER_CONTENTS_ID.sendSync(ipcRenderer),
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
      state.settings = action.payload;
      SLEvent.SAVE_SETTINGS.sendTo(ipcRenderer, state.databaseHandlerId, action.payload);
      state.isVisible = !state.isVisible;
    },
    saveSettingsDone(state) {
      state.isSaving = false;
    },
  },
});

export const { toggleVisibility, toggleSetting, saveSettingsDone, loadSettings, saveSettings } = SettingsModal.actions;

export default SettingsModal.reducer;
