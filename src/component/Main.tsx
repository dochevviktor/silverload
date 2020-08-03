import React, {useState} from 'react';
import styles from './Main.module.css';
import {asSequence as stream} from 'sequency';
import 'material-design-lite';
import Tabs from './tabs/Tabs';
import ImagePanel from './image.panel/ImagePanel';
import {SLTab} from "../interface/Common";
import SLBasicTab from "../class/SLBasicTab";

interface SLMainState {
  tabs: SLTab[];
}

const Main = () => {
  const initialState: SLMainState = {tabs: [new SLBasicTab()]}
  const [tabsState, updateTabsState] = useState(initialState);

  const addTab = () => {
    const newTabId: number = getNextId(tabsState.tabs)
    const newTab: SLTab = new SLBasicTab(newTabId);
    const tabs: SLTab[] = [...tabsState.tabs, newTab];
    updateTabsState({tabs: tabs});
    return newTab;
  };

  const getNextId = (tabs: SLTab[]) => (stream(tabs).map(it => it.id).max() ?? 0) + 1

  const removeTab = (tabIndex: number) => {
    const tabs = [...tabsState.tabs];
    tabs.splice(tabIndex, 1);
    updateTabsState({tabs: tabs});
    return tabs;
  };

  return (
    <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
      <header className={styles.mainHeader + ' mdl-layout__header mdl-layout__header--scroll'}>
        <div className="mdl-layout__header-row">
          <Tabs tabs={tabsState.tabs} remove={removeTab} add={addTab}/>
        </div>
      </header>
      <div className="mdl-layout__drawer">
        <span className="mdl-layout-title">Menu</span>
        <nav className="mdl-navigation">
          <a className="mdl-navigation__link" href="/"><i className="fas fa-folder fa-lg"/>&nbsp;&nbsp;Open in Explorer</a>
          <a className="mdl-navigation__link" href="/"><i className="fas fa-palette fa-lg"/>&nbsp;&nbsp;Open in
            Editor</a>
          <a className="mdl-navigation__link" href="/"><i className="fas fa-cog fa-lg"/>&nbsp;&nbsp;Settings</a>
          <a className="mdl-navigation__link" href="/"><i className="fas fa-info-circle fa-lg"/>&nbsp;&nbsp;About</a>
        </nav>
      </div>
      <main className="mdl-layout__content">
        <ImagePanel/>
      </main>
    </div>
  );
};

export default Main;
