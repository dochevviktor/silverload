import * as SLEvent from '../../../../common/class/SLEvent';
import { actions } from '../slices/tab.slice';
import { v4 as uuid } from 'uuid';
import SLTab from '../../../../common/class/SLTab';
import { RootState } from '../rootReducer';
import SLContextMenuItem, { SLContextMenuData } from '../../../../common/constant/SLContextMenu';

const contextAction = {};

contextAction[SLContextMenuItem.TAB_DUPLICATE] = (tab: SLTab, dispatch) => {
  const { title, path, base64, base64Hash, type, sequence } = tab;
  const newTab: SLTab = { id: uuid(), title, path, base64, base64Hash, type, sequence: sequence + 1 };

  dispatch(actions.addTabToPosition(newTab));
};

contextAction[SLContextMenuItem.TAB_REOPEN_CLOSED] = (tab: SLTab, dispatch, state: RootState) => {
  const closedTabList = [...state.tabsSlice.closedTabList];

  if (closedTabList.length > 0) {
    const path = closedTabList.shift();
    const reopenedTab: SLTab = { id: uuid(), title: 'New Tab', path, isLoading: true, sequence: tab.sequence + 1 };

    dispatch(actions.addTabToPosition(reopenedTab));
    dispatch(actions.updateClosedTabList(closedTabList));
    dispatch(actions.setActiveTab(reopenedTab.id));

    SLEvent.LOAD_TAB_IMAGE.send({ tabId: reopenedTab.id, path: reopenedTab.path });
  }
};

contextAction[SLContextMenuItem.TAB_CLOSE_OTHERS] = (tab: SLTab, dispatch): void => {
  dispatch(actions.setActiveTab(tab.id));
  dispatch(actions.closeOtherTabs());
};

contextAction[SLContextMenuItem.TAB_CLOSE_LEFT] = (tab: SLTab, dispatch): void => {
  dispatch(actions.setActiveTab(tab.id));
  dispatch(actions.closeTabsToTheLeft());
};

export const handleTabContextAction = (data: SLContextMenuData<string>, state: RootState, dispatch: unknown): void => {
  const tab = state.tabsSlice.tabList.find((it) => it.id === data.context);

  if (!tab.isLoading) {
    contextAction[data.selectedItem](tab, dispatch, state);
  }
};

export const tabContextMenu = (event: MouseEvent, tab: SLTab): void => {
  SLEvent.TAB_CTX_MENU.send({ context: tab.id, x: event.x, y: event.y });
};
