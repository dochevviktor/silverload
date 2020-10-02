import React, { MouseEvent } from 'react';
import styles from './Tab.module.less';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import SLBasicTab from '../../../class/SLBasicTab';
import { TabSlice } from '../../../redux/slices/tab.slice';

interface TabParams {
  currentTab: SLBasicTab;
  position: number;
  close: (event: MouseEvent) => void;
}

const Tab = (props: TabParams): JSX.Element => {
  const tabStyle = [styles.tabStyle];

  const activeTab = useSelector((state: RootState) => state.tabSlice.activeTab);

  const isActiveTab = (tab: SLBasicTab) => activeTab.id === tab.id;

  const dispatch = useDispatch();

  const updateActiveTab = (tab: SLBasicTab) => dispatch(TabSlice.actions.setActiveTab(tab));

  if (isActiveTab(props.currentTab)) {
    tabStyle.push(styles.tabActive);
  }

  return (
    <div className={tabStyle.join(' ')} onClick={() => updateActiveTab(props.currentTab)}>
      <p>{props.currentTab.title}</p>
      <FontAwesomeIcon icon={faTimes} onClick={props.close} />
    </div>
  );
};

export default Tab;
