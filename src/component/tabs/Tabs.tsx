import React, { useState, useRef, WheelEvent, MouseEvent } from 'react';
import { asSequence as stream } from 'sequency';
import styles from './Tabs.module.less';
import Tab from './tab/Tab';
import { SLTab } from '../../interface/Common';

interface TabsParams {
  remove: (arg0: number) => SLTab[];
  add: () => SLTab;
  tabs: SLTab[];
}

const Tabs = (props: TabsParams): JSX.Element => {
  const [activeTab, updateActiveTab] = useState(1);
  const isActiveTab = (tabId: number) => activeTab === tabId;
  const scrollRef = useRef<HTMLDivElement>(null);
  let waitForMe = false;
  let nextNumber = 0.0;

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
    return new Promise(() => setTimeout(() => scrollToRightEnd(), 25));
  };

  const scrollToRightEnd = () => {
    scrollRef?.current?.scrollBy({
      top: 0,
      left: 100,
      behavior: 'smooth',
    });
  };

  const smoothScroll = async (left: number) => {
    nextNumber += left;
    if (!waitForMe) {
      waitForMe = true;
      const myNum = nextNumber;
      nextNumber = left;
      scrollRef?.current?.scrollBy({
        top: 0,
        left: myNum / 2,
        behavior: 'smooth',
      });
      await new Promise(() => setTimeout(() => (waitForMe = false), 75));
    } else {
      return;
    }
  };

  return (
    <div
      ref={scrollRef}
      className={styles.tabsStyle}
      onWheel={(event: WheelEvent) => smoothScroll(event.deltaY)}
    >
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
  );
};

export default Tabs;
