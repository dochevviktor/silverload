import { AppThunk } from '../store';
import * as SLEvent from '../../../common/class/SLEvent';
import { actions } from '../slices/settings.slice';
import SLSettings from '../../../common/class/SLSettings';

const databaseHandlerId = SLEvent.GET_DATABASE_HANDLER_CONTENTS_ID.sendSync(window.ipcRenderer);

export const loadSettings = (): AppThunk => (dispatch) => {
  SLEvent.LOAD_SETTINGS.sendTo(window.ipcRenderer, databaseHandlerId);
  SLEvent.LOAD_SETTINGS.once(window.ipcRenderer, (args) => dispatch(actions.loadSettings(args)));
};

export const saveSettings =
  (settings: SLSettings[]): AppThunk =>
  (dispatch) => {
    dispatch(actions.saveSettings());
    SLEvent.SAVE_SETTINGS.sendTo(window.ipcRenderer, databaseHandlerId, settings);
    SLEvent.SAVE_SETTINGS.once(window.ipcRenderer, () => dispatch(actions.saveSettingsDone()));
  };
