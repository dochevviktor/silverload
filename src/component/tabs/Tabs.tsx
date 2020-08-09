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
    return setTimeoutPromise(() => scrollToValue(100), 100);
  };

  const smoothScroll = async (left: number) => {
    if (Math.sign(nextNumber) !== Math.sign(left)) {
      nextNumber = left;
    } else {
      nextNumber += left;
    }
    if (!waitForMe) {
      waitForMe = true;
      await setTimeoutPromise(() => scrollToValue(nextNumber), 100);
      nextNumber = 0;
      await setTimeoutPromise(() => (waitForMe = false), 100);
    }
  };

  const setTimeoutPromise = (fn: () => void, timeout = 0): Promise<void> =>
    new Promise((resolve) => setTimeout(() => resolve(fn()), timeout));

  const scrollToValue = (left: number) => {
    scrollRef?.current?.scrollBy({
      top: 0,
      left: left,
      behavior: 'smooth',
    });
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
