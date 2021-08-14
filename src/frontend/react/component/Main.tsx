import { useEffect } from 'react';
import styles from './Main.scss';
import Tabs from './tabs/Tabs';
import ImagePanel from './image-panel/ImagePanel';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/rootReducer';
import { addTabListeners, loadFileArgs, removeTabListeners } from '../store/thunks/tab.thunk';
import { addSettingsListeners, removeSettingsListeners } from '../store/thunks/settings.thunk';
import SLSettingsModal from './settings/SLSettingsModal';

const Main = (): JSX.Element => {
  const tabListSize = useSelector((state: RootState) => state.tabsSlice.tabList.length);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFileArgs());
    dispatch(addTabListeners());
    dispatch(addSettingsListeners());

    return () => {
      dispatch(removeTabListeners());
      dispatch(removeSettingsListeners());
    };
  }, []);

  return (
    <>
      <div className={styles.mainHeader}>
        <Tabs />
      </div>
      <div>{tabListSize > 0 ? <ImagePanel /> : null}</div>
      <SLSettingsModal />
    </>
  );
};

export default Main;
