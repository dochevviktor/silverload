import { combineReducers } from '@reduxjs/toolkit';
import { TabSlice } from './slices/tab.slice';

const rootReducer = combineReducers({ tabSlice: TabSlice.reducer });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
