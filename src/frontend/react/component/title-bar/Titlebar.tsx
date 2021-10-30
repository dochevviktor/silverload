import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowRestore, faWindowMaximize, faWindowMinimize, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import SLEvent from '../../../../common/class/SLEvent';
import { RootState } from '../../store/rootReducer';
import { saveTabsThenExit } from '../../store/thunks/tab.thunk';
import { SLSetting, findSetting } from '../../../../common/class/SLSettings';
import SLIcon from '../SLIcon';
import styles from './Titlebar.scss';

const TitleBar = (): JSX.Element => {
  const [isMaximized, updateMaxState] = useState(false);

  const dispatch = useDispatch();

  const tabTitle = useSelector((state: RootState) => state.tabsSlice.activeTab?.title);
  const tabCount = useSelector((state: RootState) => state.tabsSlice.tabList.length);
  const settings = useSelector((state: RootState) => state.settingsModal.settings);
  const closeWindow = (): void => {
    if (findSetting(settings, SLSetting.SAVE_ON_EXIT).flag) {
      dispatch(saveTabsThenExit());
    } else {
      SLEvent.CLOSE_WINDOW.send();
    }
  };

  useEffect(() => {
    const removeList: (() => void)[] = [];

    removeList.push(SLEvent.WINDOW_MAXIMIZED.on(() => updateMaxState(true)));
    removeList.push(SLEvent.WINDOW_UN_MAXIMIZED.on(() => updateMaxState(false)));

    return () => removeList.forEach((removeListener) => removeListener());
  }, []);

  const getMaximisedButtonIcon = isMaximized ? faWindowRestore : faWindowMaximize;

  return (
    <div className={styles.titleBar}>
      <p className={styles.logo}>
        <SLIcon />
        <p>SliverLoad</p>
      </p>
      <p>{tabCount ? tabTitle : ''}</p>
      <div className={styles.titleBar}>
        <button className={styles.titleBarButton} onClick={() => SLEvent.MINIMIZE_WINDOW.send()}>
          <FontAwesomeIcon icon={faWindowMinimize} size="xs" />
        </button>
        <button className={styles.titleBarButton} onClick={() => SLEvent.MAXIMIZE_WINDOW.send()}>
          <FontAwesomeIcon icon={getMaximisedButtonIcon} size="xs" />
        </button>
        <button className={styles.titleBarCloseButton} onClick={closeWindow}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
