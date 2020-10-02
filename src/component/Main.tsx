import React, { useEffect, useState } from 'react';
import styles from './Main.module.less';
import Tabs from './tabs/Tabs';
import ImagePanel from './image.panel/ImagePanel';
import SLBasicTab from '../class/SLBasicTab';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/rootReducer';
import { TabSlice } from '../redux/slices/tab.slice';

interface SLMainState {
  tabs: SLBasicTab[];
}

const Main = (): JSX.Element => {
  const initialState: SLMainState = { tabs: [] };

  const activeTab = useSelector((state: RootState) => state.tabSlice.activeTab);

  const dispatch = useDispatch();

  const updateActiveTab = (tab: SLBasicTab) => dispatch(TabSlice.actions.setActiveTab(tab));

  const isActiveTab = (tab: SLBasicTab) => activeTab.id === tab.id;

  const [tabsState, updateTabsState] = useState(initialState);

  const addTab = () => {
    const newTab: SLBasicTab = new SLBasicTab();
    const tabs: SLBasicTab[] = [...tabsState.tabs, newTab];

    updateTabsState({ tabs: tabs });
    updateActiveTab(newTab);
  };

  const removeTab = (tabIndex: number) => {
    const tabs = [...tabsState.tabs];

    const deletedTab = tabs.splice(tabIndex, 1)[0];

    const nextPos = tabs.length - 1 >= tabIndex ? tabIndex : tabs.length - 1;

    const nextActiveTab = isActiveTab(deletedTab) && nextPos >= 0 ? tabs[nextPos] : null;

    updateTabsState({ tabs: tabs });

    updateActiveTab(nextActiveTab);
  };

  const imagePanel = activeTab ? <ImagePanel /> : null;

  // On application start we either create a new tab or load previous state (WIP)
  useEffect(() => {
    addTab();
  }, []);

  return (
    <>
      <div className={styles.mainHeader}>
        <Tabs tabs={tabsState.tabs} remove={removeTab} add={addTab} />
      </div>
      <div>{imagePanel}</div>
    </>
  );
};

export default Main;
