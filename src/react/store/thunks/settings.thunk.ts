import { AppThunk } from '../store';
import * as SLEvent from '../../../common/class/SLEvent';
import { loadSettings } from '../slices/settings.slice';

const { ipcRenderer } = window.require('electron');

export const load = (): AppThunk => (dispatch) => {
  SLEvent.LOAD_SETTINGS.sendTo(ipcRenderer, SLEvent.GET_DATABASE_HANDLER_CONTENTS_ID.sendSync(ipcRenderer));
  SLEvent.LOAD_SETTINGS.once(ipcRenderer, (args) => dispatch(loadSettings(args)));
};
