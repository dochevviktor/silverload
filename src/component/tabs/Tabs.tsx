import React, { useRef, WheelEvent, MouseEvent, RefObject } from 'react';
import styles from './Tabs.module.less';
import Tab from './tab/Tab';
import SLScroll from '../../class/SLScroll';
import SLDrawer from '../drawer/SLDrawer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import SLBasicTab from '../../class/SLBasicTab';

interface TabsParams {
  remove: (arg0: number) => void;
  add: () => void;
  tabs: SLBasicTab[];
  isActiveTab: (arg0: SLBasicTab) => boolean;
  updateActiveTab: (arg0: SLBasicTab) => void;
  imagePanelElement: RefObject<HTMLDivElement> | null;
}

const Tabs = (props: TabsParams): JSX.Element => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = new SLScroll(scrollRef?.current);

  const removeTab = (event: MouseEvent, index: number) => {
    event.stopPropagation();
    props.remove(index);
  };

  const addTab = () => {
    props.add();

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
            active={props.isActiveTab(tab)}
            position={index}
            click={() => props.updateActiveTab(tab)}
            close={(event: MouseEvent) => removeTab(event, index)}
            key={tab.id}
          />
        ))}
        <FontAwesomeIcon icon={faPlus} size="2x" onClick={addTab} />
      </div>
    </div>
  );
};

export default Tabs;
