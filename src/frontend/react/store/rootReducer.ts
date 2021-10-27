import { combineReducers } from '@reduxjs/toolkit';
import TabList from './slices/tab.slice';
import DragAndDrop from './slices/drag.slice';
import SettingsModal from './slices/settings.slice';

export const rootReducer = combineReducers({
  tabsSlice: TabList,
  dragEvent: DragAndDrop,
  settingsModal: SettingsModal,
});

export type RootState = ReturnType<typeof rootReducer>;
