import React, { useRef, useState } from 'react';
import styles from './Main.module.less';
import { asSequence as stream } from 'sequency';
import Tabs from './tabs/Tabs';
import ImagePanel from './image.panel/ImagePanel';
import { SLTab } from '../interface/Common';
import SLBasicTab from '../class/SLBasicTab';

interface SLMainState {
  tabs: SLTab[];
}

const Main = (): JSX.Element => {
  const initialState: SLMainState = { tabs: [new SLBasicTab()] };

  const [tabsState, updateTabsState] = useState(initialState);

  const imagePanelRef = useRef<HTMLDivElement>(null);

  const addTab = () => {
    const newTabId: number = getNextId(tabsState.tabs);
    const newTab: SLTab = new SLBasicTab(newTabId);
    const tabs: SLTab[] = [...tabsState.tabs, newTab];

    updateTabsState({ tabs: tabs });

    return newTab;
  };

  const getNextId = (tabs: SLTab[]) =>
    (stream(tabs)
      .map((it) => it.id)
      .max() ?? 0) + 1;

  const removeTab = (tabIndex: number) => {
    const tabs = [...tabsState.tabs];

    tabs.splice(tabIndex, 1);
    updateTabsState({ tabs: tabs });

    return tabs;
  };

  return (
    <>
      <div className={styles.mainHeader}>
        <Tabs tabs={tabsState.tabs} remove={removeTab} add={addTab} imagePanelElement={imagePanelRef} />
      </div>
      <div ref={imagePanelRef}>
        <ImagePanel />
      </div>
    </>
  );
};

export default Main;
