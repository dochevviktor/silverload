import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { rootReducer, RootState } from './rootReducer';
import thunk from 'redux-thunk';

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    store.replaceReducer(rootReducer);
  });
}

export default store;
