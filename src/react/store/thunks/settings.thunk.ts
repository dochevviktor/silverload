import { AppThunk } from '../store';
import * as SLEvent from '../../../common/class/SLEvent';
import { actions } from '../slices/settings.slice';
import SLSettings from '../../../common/class/SLSettings';

export const loadSettings = (): AppThunk => (dispatch) => {
  SLEvent.LOAD_SETTINGS.once((args) => dispatch(actions.loadSettings(args)));
  SLEvent.LOAD_SETTINGS.send();
};

export const saveSettings =
  (settings: SLSettings[]): AppThunk =>
  (dispatch) => {
    dispatch(actions.saveSettings());
    SLEvent.SAVE_SETTINGS.once(() => dispatch(actions.saveSettingsDone()));
    SLEvent.SAVE_SETTINGS.send(settings);
  };
