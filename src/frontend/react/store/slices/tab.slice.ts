import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import SLTab from '../../../../common/class/SLTab';
import { SLTabImageData } from '../../../../common/interface/SLTabImageData';
import SLContextMenuItem, { SLContextMenuData } from '../../../../common/constant/SLContextMenu';
import { v4 as uuid } from 'uuid';

interface SLTabListSlice {
  activeTab: SLTab;
  isSaving: boolean;
  isDragging: boolean;
  dragPosition: number;
  dragDirection: number;
  tabList: SLTab[];
}

interface SLImagePos {
  translateX: number;
  translateY: number;
}

interface SLImageData {
  title: string;
  path: string;
}

interface SLTabShiftPos {
  tab: SLTab;
  tabWidth: number;
}

const initialTabListState: SLTabListSlice = {
  activeTab: null,
  isSaving: false,
  isDragging: false,
  dragPosition: 0,
  dragDirection: 0,
  tabList: [],
};

const setData = (tab: SLTab, data: SLImageData) => {
  tab.title = data.title;
  tab.path = data.path;
  resetSizeAndPos(tab);
};

const setPosition = (tab: SLTab, position: SLImagePos) => {
  tab.translateX = position.translateX;
  tab.translateY = position.translateY;
};

const setSize = (tab: SLTab, multiplier: number) => {
  tab.scaleX *= multiplier;
  tab.scaleY *= multiplier;
};

const resetSizeAndPos = (tab: SLTab) => {
  tab.translateX = 0;
  tab.translateY = 0;
  tab.scaleX = 1;
  tab.scaleY = 1;
};

const getTabById = (state, tabId): SLTab => state.tabList.find((it) => it.id === tabId);

const setIsLoading = (state, tabId: string, flag: boolean) => {
  if (tabId === state.activeTab.id) {
    state.activeTab.isLoading = flag;
  }
  getTabById(state, tabId).isLoading = flag;
};

const setIsDragging = (state, tabId: string, flag: boolean) => {
  if (tabId === state.activeTab.id) {
    state.activeTab.isDragging = flag;
  }
  getTabById(state, tabId).isDragging = flag;
  state.isDragging = flag;
};

const setLeftTabShift = (state, tab: SLTab) => {
  if (tab.id === state.activeTab.id) {
    state.activeTab.shiftLeft = true;
  }
  tab.shiftLeft = true;
};

const setRightTabShift = (state, tab: SLTab) => {
  if (tab.id === state.activeTab.id) {
    state.activeTab.shiftRight = true;
  }
  tab.shiftRight = true;
};

const resetShift = (state, tab: SLTab) => {
  if (tab.id === state.activeTab.id) {
    state.activeTab.shiftRight = false;
    state.activeTab.shiftLeft = false;
  }
  tab.shiftRight = false;
  tab.shiftLeft = false;
};

const resetAllTabShits = (state) => {
  state.activeTab.shiftLeft = false;
  state.activeTab.shiftRight = false;
  state.tabList.forEach((it) => {
    it.shiftLeft = false;
    it.shiftRight = false;
  });
};

export const TabListSlice = createSlice({
  name: 'TabListSlice',
  initialState: initialTabListState,
  reducers: {
    addTab(state, { payload: tab }: PayloadAction<SLTab>) {
      resetSizeAndPos(tab);
      tab.sequence = state.tabList.length;
      state.tabList.push(tab);
    },
    setTabLoading(state, { payload: tabId }: PayloadAction<string>) {
      setIsLoading(state, tabId, true);
    },
    setTabDragging(state, { payload: tabId }: PayloadAction<string>) {
      setIsDragging(state, tabId, true);
    },
    setTabNotDragging(state, { payload: tabIt }: PayloadAction<SLTabShiftPos>) {
      const tabPosition = tabIt.tab.sequence;
      const tabShift = Math.round(state.dragPosition / tabIt.tabWidth) + tabPosition;

      setIsDragging(state, tabIt.tab.id, false);

      if (tabPosition !== tabShift && tabPosition >= 0 && tabPosition + 1 <= state.tabList.length) {
        const result = Array.from(state.tabList);
        const [removed] = result.splice(tabPosition, 1);

        result.splice(tabShift, 0, removed);
        result.forEach((it) => {
          it.sequence = result.indexOf(it);
          if (it.id === state.activeTab.id) {
            state.activeTab.sequence = result.indexOf(it);
          }
        });
        state.tabList = result;
      }
    },
    setTabShiftLeft(state, { payload: tabPos }: PayloadAction<Array<number>>) {
      tabPos
        .filter((it) => it >= 0 && it + 1 <= state.tabList.length)
        .map((it) => setLeftTabShift(state, state.tabList[it]));
    },
    setTabShiftRight(state, { payload: tabPos }: PayloadAction<Array<number>>) {
      tabPos
        .filter((it) => it >= 0 && it + 1 <= state.tabList.length)
        .map((it) => setRightTabShift(state, state.tabList[it]));
    },
    resetTabShift(state, { payload: tabPos }: PayloadAction<Array<number>>) {
      state.tabList.filter((it) => !tabPos.includes(it.sequence)).map((it) => resetShift(state, it));
    },
    loadTabImage(state, { payload: tabImageData }: PayloadAction<SLTabImageData>) {
      setIsLoading(state, tabImageData.tabId, false);
      if (state.activeTab.id === tabImageData.tabId) {
        state.activeTab.base64 = tabImageData.base64;
        state.activeTab.path = tabImageData.path;
        state.activeTab.title = tabImageData.title;
        state.activeTab.base64Hash = tabImageData.base64Hash;
        state.activeTab.type = tabImageData.type;
        state.activeTab.isPaused = false;
        state.activeTab.currentTime = 0;
        state.activeTab.loadingProgress = null;
      }
      const tabById = getTabById(state, tabImageData.tabId);

      tabById.base64 = tabImageData.base64;
      tabById.path = tabImageData.path;
      tabById.title = tabImageData.title;
      tabById.base64Hash = tabImageData.base64Hash;
      tabById.type = tabImageData.type;
      tabById.type = tabImageData.type;
      tabById.loadingProgress = null;
    },
    loadTabProgress(state, { payload: tabImageData }: PayloadAction<SLTabImageData>) {
      if (state.activeTab.id === tabImageData.tabId) {
        state.activeTab.loadingProgress = tabImageData.loadingProgress;
      }
      getTabById(state, tabImageData.tabId).loadingProgress = tabImageData.loadingProgress;
    },
    removeTab(state, { payload: tabIndex }: PayloadAction<number>) {
      state.tabList[tabIndex].base64 = null;
      state.tabList[tabIndex].base64Hash = null;
      state.tabList[tabIndex].path = null;
      state.tabList.splice(tabIndex, 1);

      const nextPos = state.tabList.length - 1 >= tabIndex ? tabIndex : state.tabList.length - 1;

      const nextActiveTab = nextPos >= 0 ? state.tabList[nextPos] : null;

      state.tabList.forEach((it) => (it.sequence = state.tabList.indexOf(it)));

      if (nextActiveTab) {
        state.activeTab = nextActiveTab;
      }
    },
    setActiveTab(state, { payload: tab }: PayloadAction<SLTab>) {
      if (state.activeTab && state.activeTab.type === 'video') {
        const videoElement = <HTMLVideoElement>document.getElementById(state.activeTab.id);
        const tabById = getTabById(state, state.activeTab.id);

        if (tabById && videoElement) {
          tabById.currentTime = videoElement.currentTime;
          tabById.isPaused = videoElement.paused;
        }
      }
      state.activeTab = tab;
    },
    setActiveTabData(state, { payload: imageData }: PayloadAction<SLImageData>) {
      setData(state.activeTab, imageData);
      setData(getTabById(state, state.activeTab.id), imageData);
    },
    setImagePosition(state, { payload: position }: PayloadAction<SLImagePos>) {
      if (position) {
        setPosition(state.activeTab, position);
        setPosition(getTabById(state, state.activeTab.id), position);
      } else {
        resetSizeAndPos(state.activeTab);
        resetSizeAndPos(getTabById(state, state.activeTab.id));
      }
    },
    changeImageSize(state, { payload: size }: PayloadAction<number>) {
      setSize(state.activeTab, size);
      setSize(getTabById(state, state.activeTab.id), size);
    },
    loadTabs(state, { payload: tab }: PayloadAction<SLTab[]>) {
      const loadedIds: string[] = state.tabList.map((it) => it.id);

      tab.filter((it) => !loadedIds.find((id) => id === it.id)).forEach((it) => state.tabList.push(it));

      if (state.tabList.length > 0) {
        state.activeTab = state.tabList[0];
      }
    },
    saveTabs(state) {
      state.isSaving = true;
    },
    saveTabsDone(state) {
      state.isSaving = false;
    },
    setIsSaving(state, { payload: isSaving }: PayloadAction<boolean>) {
      state.isSaving = isSaving;
    },
    setIsLoading(state, { payload: isLoading }: PayloadAction<boolean>) {
      state.activeTab.isLoading = isLoading;
    },
    setDragPosition(state, { payload: dragPosition }: PayloadAction<number>) {
      if (state.dragPosition > state.dragPosition + dragPosition) {
        state.dragDirection = 1;
      } else if (state.dragPosition < state.dragPosition + dragPosition) {
        state.dragDirection = -1;
      } else {
        state.dragDirection = 0;
      }
      state.dragPosition += dragPosition;
    },
    resetDragPosition(state) {
      state.dragPosition = 0;
      resetAllTabShits(state);
    },
    handleContextAction(state, { payload: data }: PayloadAction<SLContextMenuData<string>>) {
      const contextTab = getTabById(state, data.context);

      if (contextTab.isLoading) {
        return;
      }

      if (data.selectedItem === SLContextMenuItem.TAB_DUPLICATE) {
        const { title, path, base64, base64Hash, type } = contextTab;
        const newTab: SLTab = { id: uuid(), title, path, base64, base64Hash, type };

        state.tabList.splice(state.tabList.indexOf(contextTab) + 1, 0, newTab);
        state.tabList.forEach((it, index) => (it.sequence = index));
      } else if (data.selectedItem === SLContextMenuItem.TAB_CLOSE_OTHERS) {
        const tab = getTabById(state, state.activeTab);

        state.tabList = [tab];
        state.tabList.forEach((it, index) => (it.sequence = index));
      } else if (data.selectedItem === SLContextMenuItem.TAB_CLOSE_LEFT) {
        const tab = getTabById(state, state.activeTab);

        state.tabList.splice(0, state.tabList.indexOf(tab));
        state.tabList.forEach((it, index) => (it.sequence = index));
      }
    },
  },
});

export const {
  removeTab,
  setActiveTab,
  setActiveTabData,
  setImagePosition,
  changeImageSize,
  setDragPosition,
  resetDragPosition,
  setTabDragging,
  setTabNotDragging,
  setTabShiftLeft,
  setTabShiftRight,
  resetTabShift,
} = TabListSlice.actions;

export const actions = TabListSlice.actions;

export default TabListSlice.reducer;
