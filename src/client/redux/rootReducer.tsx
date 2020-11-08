import { combineReducers } from '@reduxjs/toolkit';
import { TabListSlice } from './slices/tab.slice';

const rootReducer = combineReducers({ tabsSlice: TabListSlice.reducer });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
