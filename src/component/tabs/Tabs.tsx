import React, {useState, useRef, WheelEvent, MouseEvent} from 'react';
import {asSequence as stream} from 'sequency';
import styles from './Tabs.module.less';
import Tab from './tab/Tab';
import {SLTab} from "../../interface/Common";

interface TabsParams {
  remove: (arg0: number) => SLTab[];
  add: () => any;
  tabs: SLTab[];
}

const Tabs = (props: TabsParams) => {

  const [activeTab, updateActiveTab] = useState(1);
  const isActiveTab = (tabId: number) => activeTab === tabId;
  const scrollRef = useRef<HTMLDivElement>(null);

  const removeTab = (event: MouseEvent, index: number, id: number) => {
    event.stopPropagation();
    const remainingTabs: SLTab[] = props.remove(index);
    if (isActiveTab(id)) {
      updateActiveTab(stream(remainingTabs).map((it) => it.id).max() ?? 1);
    }
  }

  const addTab = () => {
    const newTab = props.add()
    updateActiveTab(newTab.id)
    return new Promise(() => setTimeout(() => scrollToRightEnd(), 25));
  }

  const scrollToRightEnd = () => {
    scrollRef?.current?.scrollTo({
      top: 0,
      left: scrollRef.current.scrollLeft + 100,
      behavior: 'smooth'
    });
  }

  const onWheel = (event: WheelEvent) => {
    scrollRef?.current?.scrollTo({
      top: 0,
      left: scrollRef?.current?.scrollLeft + event.deltaY,
      behavior: 'smooth'
    });
  };

  return (
    <div ref={scrollRef}
         className={styles.tabsStyle}
         onWheel={onWheel}>
      {props.tabs.map((tab, index) =>
        <Tab id={tab.id}
             title={tab.title}
             active={isActiveTab(tab.id)}
             position={index}
             click={() => updateActiveTab(tab.id)}
             close={(event: MouseEvent) => removeTab(event, index, tab.id)}
             key={tab.id}/>
      )}
      <i className="fas fa-plus fa-lg" onClick={addTab}/>
    </div>
  );
};

export default Tabs;
