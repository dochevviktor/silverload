import { AppThunk } from '../store';
import * as SLEvent from '../../../common/class/SLEvent';
import { loadTabs } from '../slices/tab.slice';

const { ipcRenderer } = window.require('electron');

export const load = (): AppThunk => async (dispatch) => {
  SLEvent.LOAD_TABS.sendTo(ipcRenderer, SLEvent.GET_DATABASE_HANDLER_CONTENTS_ID.sendSync(ipcRenderer));
  SLEvent.LOAD_TABS.once(ipcRenderer, (args) => dispatch(loadTabs(args)));
};
