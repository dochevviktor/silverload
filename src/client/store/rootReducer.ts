import { combineReducers } from '@reduxjs/toolkit';
import TabListSlice from './slices/tab.slice';
import DragAndDrop from './slices/drag.slice';

const rootReducer = combineReducers({ tabsSlice: TabListSlice, dragEvent: DragAndDrop });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
