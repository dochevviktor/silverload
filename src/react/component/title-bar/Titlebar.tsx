import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowRestore, faWindowMaximize, faWindowMinimize, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faSuperpowers } from '@fortawesome/free-brands-svg-icons';
import styles from './Titlebar.scss';
import * as SLEvent from '../../../common/class/SLEvent';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';

const { ipcRenderer } = window.require('electron');

const TitleBar = (): JSX.Element => {
  const [isMaximized, updateMaxState] = useState(false);

  const tabTitle = useSelector((state: RootState) => state.tabsSlice.activeTab?.title);
  const tabCount = useSelector((state: RootState) => state.tabsSlice.tabList.length);

  useEffect(() => {
    const removeList: (() => void)[] = [];

    removeList.push(SLEvent.WINDOW_MAXIMIZED.on(ipcRenderer, () => updateMaxState(true)));
    removeList.push(SLEvent.WINDOW_UN_MAXIMIZED.on(ipcRenderer, () => updateMaxState(false)));

    return () => removeList.forEach((removeListener) => removeListener());
  }, []);

  const getMaximisedButtonIcon = isMaximized ? faWindowRestore : faWindowMaximize;

  return (
    <div className={styles.titleBar}>
      <p>
        <FontAwesomeIcon icon={faSuperpowers} size="sm" />
        &nbsp;Sliverload
      </p>
      <p>{tabCount ? tabTitle : ''}</p>
      <div className={styles.titleBar}>
        <button className={styles.titleBarButton} onClick={() => SLEvent.MINIMIZE_WINDOW.send(ipcRenderer)}>
          <FontAwesomeIcon icon={faWindowMinimize} size="xs" />
        </button>
        <button className={styles.titleBarButton} onClick={() => SLEvent.MAXIMIZE_WINDOW.send(ipcRenderer)}>
          <FontAwesomeIcon icon={getMaximisedButtonIcon} size="xs" />
        </button>
        <button className={styles.titleBarCloseButton} onClick={() => SLEvent.CLOSE_WINDOW.send(ipcRenderer)}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
