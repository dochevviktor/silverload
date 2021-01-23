import { AppThunk } from '../store';
import { SLEvent } from '../../../common/constant/SLEvent';
import { SLSettingEvent } from '../../../common/class/SLSettings';
import { loadSettings } from '../slices/settings.slice';

const { ipcRenderer } = window.require('electron');

export const load = (): AppThunk => (dispatch) => {
  const webContentsId = ipcRenderer.sendSync(SLEvent.GET_DATABASE_HANDLER_CONTENTS_ID);

  ipcRenderer.sendTo(webContentsId, SLSettingEvent.LOAD_SETTINGS);
  ipcRenderer.once(SLSettingEvent.LOAD_SETTINGS, (event, args) => dispatch(loadSettings(args)));
};