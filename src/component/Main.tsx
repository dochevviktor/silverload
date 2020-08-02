import React, { useState } from 'react';
import styles from './Main.module.css';
import {asSequence as stream} from 'sequency';
import 'material-design-lite';
import Tabs from './tabs/Tabs';
import ImagePanel from './image_panel/ImagePanel';
import {GenericTab} from "../interface/Common";

const Main = () => {
  const [tabsState, updateTabsState] = useState({tabs: [{id: 1, title: "New Tab"}]});

  const addTab = () => {
    const newTabId : number = getNextId(tabsState.tabs)
    const newTab : GenericTab = {id: newTabId, title: "New Tab"};
    const tabs : GenericTab[]  = [...tabsState.tabs, newTab];
    updateTabsState({tabs: tabs});
    return newTab;
  };

  const getNextId = (tabs : GenericTab[]) => (stream(tabs).map(it => it.id).max()??0) + 1

  const removeTab = (tabIndex : number) => {
    const tabs = [...tabsState.tabs];
    tabs.splice(tabIndex, 1);
    updateTabsState({tabs: tabs});
    return tabs;
  };

  return (
    <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header className={styles.mainHeader +' mdl-layout__header mdl-layout__header--scroll'}>
      <div className="mdl-layout__header-row">
        <Tabs tabs={tabsState.tabs} remove={removeTab} add={addTab}/>
      </div>
    </header>
    <div className="mdl-layout__drawer">
      <span className="mdl-layout-title">Menu</span>
      <nav className="mdl-navigation">
        <a className="mdl-navigation__link" href="/"><i className="fas fa-folder fa-lg"/>&nbsp;&nbsp;Open in Explorer</a>
        <a className="mdl-navigation__link" href="/"><i className="fas fa-palette fa-lg"/>&nbsp;&nbsp;Open in Editor</a>
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
