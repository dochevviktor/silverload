import React from 'react';
import styles from './Main.module.less';
import Tabs from './tabs/Tabs';
import ImagePanel from './image.panel/ImagePanel';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/rootReducer';

const Main = (): JSX.Element => {
  const tabListSize = useSelector((state: RootState) => state.tabsSlice.tabList.length);

  return (
    <>
      <div className={styles.mainHeader}>
        <Tabs />
      </div>
      <div>{tabListSize > 0 ? <ImagePanel /> : null}</div>
    </>
  );
};

export default Main;
