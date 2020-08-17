import React, { useState, useRef, WheelEvent, MouseEvent, RefObject } from 'react';
import { asSequence as stream } from 'sequency';
import styles from './Tabs.module.less';
import Tab from './tab/Tab';
import { SLTab } from '../../interface/Common';
import SLScroll from '../../class/SLScroll';
import SLDrawer from '../drawer/SLDrawer';

interface TabsParams {
  remove: (arg0: number) => SLTab[];
  add: () => SLTab;
  tabs: SLTab[];
  imagePanelElement: RefObject<HTMLDivElement> | null;
}

const Tabs = (props: TabsParams): JSX.Element => {
  const [activeTab, updateActiveTab] = useState(1);

  const isActiveTab = (tabId: number) => activeTab === tabId;

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = new SLScroll(scrollRef?.current);

  const removeTab = (event: MouseEvent, index: number, id: number) => {
    event.stopPropagation();
    const remainingTabs: SLTab[] = props.remove(index);

    if (isActiveTab(id)) {
      updateActiveTab(
        stream(remainingTabs)
          .map((it) => it.id)
          .max() ?? 1
      );
    }
  };

  const addTab = () => {
    const newTab = props.add();

    updateActiveTab(newTab.id);

    return scroll.scrollLeft(100, 10);
  };

  const smoothScroll = async (left: number) => {
    return scroll.scrollLeft(left);
  };

  return (
    <div className={styles.tabsContainer}>
      <SLDrawer imagePanelElement={props.imagePanelElement} />
      <div ref={scrollRef} className={styles.tabsStyle} onWheel={(event: WheelEvent) => smoothScroll(event.deltaY)}>
        {props.tabs.map((tab, index) => (
          <Tab
            id={tab.id}
            title={tab.title}
            active={isActiveTab(tab.id)}
            position={index}
            click={() => updateActiveTab(tab.id)}
            close={(event: MouseEvent) => removeTab(event, index, tab.id)}
            key={tab.id}
          />
        ))}
        <i className="fas fa-plus fa-lg" onClick={addTab} />
      </div>
    </div>
  );
};

export default Tabs;
