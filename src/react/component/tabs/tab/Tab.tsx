import { MouseEvent } from 'react';
import styles from './Tab.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import SLTab from '../../../../common/class/SLTab';
import { removeTab, setActiveTab } from '../../../store/slices/tab.slice';
import { RootState } from '../../../store/rootReducer';

interface TabParams {
  tab: SLTab;
  position: number;
}

const Tab = (props: TabParams): JSX.Element => {
  const tabStyle = [styles.tabStyle];

  const dispatch = useDispatch();

  const activeTab = useSelector((state: RootState) => state.tabsSlice.activeTab);

  const remove = (event: MouseEvent) => {
    event.stopPropagation();
    dispatch(removeTab(props.position));
  };

  const updateActive = () => {
    dispatch(setActiveTab(props.tab));
  };

  if (props.tab.id === activeTab?.id) {
    tabStyle.push(styles.tabActive);
  }

  return (
    <div className={tabStyle.join(' ')} onClick={updateActive}>
      <p>{props.tab.title}</p>
      <FontAwesomeIcon icon={props.tab.isLoading ? faSpinner : faTimes} onClick={remove} spin={props.tab.isLoading} />
    </div>
  );
};

export default Tab;
