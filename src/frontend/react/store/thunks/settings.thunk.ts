import { AppThunk } from '../store';
import * as SLEvent from '../../../../common/class/SLEvent';
import { actions } from '../slices/settings.slice';
import SLSettings from '../../../../common/class/SLSettings';

const listeners: (() => void)[] = [];

export const addSettingsListeners = (): AppThunk => async (dispatch, getState) => {
  listeners.push(
    SLEvent.LOAD_SETTINGS.on((args) => {
      dispatch(actions.loadSettings(args));
      console.log('sending settings', getState().settingsModal.settings);
      SLEvent.UPDATE_SETTINGS.send(getState().settingsModal.settings);
    })
  );
  listeners.push(
    SLEvent.SAVE_SETTINGS.on(() => {
      dispatch(actions.saveSettingsDone());
      console.log('sending settings', getState().settingsModal.settings);
      SLEvent.UPDATE_SETTINGS.send(getState().settingsModal.settings);
    })
  );
};

export const removeSettingsListeners = (): AppThunk => async () => {
  while (listeners.length) listeners.pop()();
};

export const loadSettings = (): AppThunk => () => SLEvent.LOAD_SETTINGS.send();

export const saveSettings =
  (settings: SLSettings[]): AppThunk =>
  (dispatch) => {
    dispatch(actions.saveSettings());
    SLEvent.SAVE_SETTINGS.send(settings);
  };
