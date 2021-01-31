import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SLSettings from '../../../common/class/SLSettings';

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
    toggleSetting(state, { payload: index }: PayloadAction<number>) {
      state.settings[index].flag = !state.settings[index].flag;
    },
    loadSettings(state, { payload: settings }: PayloadAction<SLSettings[]>) {
      state.settings = settings;
    },
    saveSettings(state) {
      state.isSaving = true;
      state.isVisible = !state.isVisible;
    },
    saveSettingsDone(state) {
      state.isSaving = false;
    },
  },
});

export const { toggleVisibility, toggleSetting } = SettingsModal.actions;

export const actions = SettingsModal.actions;

export default SettingsModal.reducer;
