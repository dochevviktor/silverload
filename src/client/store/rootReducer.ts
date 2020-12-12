import { combineReducers } from '@reduxjs/toolkit';
import TabListSlice from './slices/tab.slice';
import DragAndDrop from './slices/drag.slice';
import SettingsModal from './slices/settings.slice';

const rootReducer = combineReducers({
  tabsSlice: TabListSlice,
  dragEvent: DragAndDrop,
  settingsModal: SettingsModal,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
