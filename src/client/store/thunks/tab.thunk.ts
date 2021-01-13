import { AppThunk } from '../store';
import { SLTabEvent } from '../../../common/class/SLTab';
import { SLDatabase } from '../../../common/constant/SLDatabase';
import { loadTabs } from '../slices/tab.slice';

const { ipcRenderer } = window.require('electron');

export const load = (): AppThunk => async (dispatch) => {
  const webContentsId = ipcRenderer.sendSync(SLDatabase.GET_DATABASE_HANDLER_CONTENTS_ID);

  ipcRenderer.sendTo(webContentsId, SLTabEvent.LOAD_TABS);
  ipcRenderer.once(SLTabEvent.LOAD_TABS, (event, args) => dispatch(loadTabs(args)));
};
