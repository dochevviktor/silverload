import React, { useEffect, useRef, WheelEvent } from 'react';
import styles from './Tabs.scss';
import Tab from './tab/Tab';
import SLScroll from '../../class/SLScroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import { TabListSlice } from '../../redux/slices/tab.slice';

const Tabs = (): JSX.Element => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = new SLScroll(scrollRef?.current);

  const tabs = useSelector((state: RootState) => state.tabsSlice.tabList);

  const dispatch = useDispatch();

  const addTab = () => {
    dispatch(TabListSlice.actions.addTab());

    return scroll.scrollLeft(100, 10);
  };

  const smoothScroll = async (left: number) => {
    return scroll.scrollLeft(left);
  };

  // On application start we either create a new tab or load previous state (WIP)
  useEffect(() => {
    dispatch(TabListSlice.actions.addTab());
  }, []);

  return (
    <div className={styles.tabsContainer}>
      <div ref={scrollRef} className={styles.tabsStyle} onWheel={(event: WheelEvent) => smoothScroll(event.deltaY)}>
        {tabs.map((tab, index) => (
          <Tab tab={tab} position={index} key={tab.id} />
        ))}
        <FontAwesomeIcon icon={faPlus} size="2x" onClick={addTab} />
      </div>
    </div>
  );
};

export default Tabs;
