import React, { MouseEvent } from 'react';
import styles from './Tab.module.less';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import SLTab from '../../../interface/SLTab';
import { TabListSlice } from '../../../redux/slices/tab.slice';
import { RootState } from '../../../redux/rootReducer';

interface TabParams {
  tab: SLTab;
  position: number;
}

const Tab = (props: TabParams): JSX.Element => {
  const tabStyle = [styles.tabStyle];

  const dispatch = useDispatch();

  const activeTab = useSelector((state: RootState) => state.tabsSlice.activeTab);

  const removeTab = (event: MouseEvent) => {
    event.stopPropagation();
    dispatch(TabListSlice.actions.removeTab(props.position));
  };

  const updateActiveTab = () => {
    dispatch(TabListSlice.actions.setActiveTab(props.tab));
  };

  if (props.tab.id === activeTab.id) {
    tabStyle.push(styles.tabActive);
  }

  return (
    <div className={tabStyle.join(' ')} onClick={updateActiveTab}>
      <p>{props.tab.title}</p>
      <FontAwesomeIcon icon={faTimes} onClick={removeTab} />
    </div>
  );
};

export default Tab;
