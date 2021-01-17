import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowRestore, faWindowMaximize, faWindowMinimize, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faSuperpowers } from '@fortawesome/free-brands-svg-icons';
import styles from './Titlebar.scss';
import { SLEvent } from '../../../common/constant/SLEvent';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';

const { ipcRenderer } = window.require('electron');

const TitleBar = (): JSX.Element => {
  const [isMaximized, updateMaxState] = useState(false);

  const tabTitle = useSelector((state: RootState) => state.tabsSlice.activeTab?.title);

  useEffect(() => {
    ipcRenderer.on(SLEvent.WINDOW_MAXIMIZED, () => updateMaxState(true));
    ipcRenderer.on(SLEvent.WINDOW_UN_MAXIMIZED, () => updateMaxState(false));

    return () => {
      ipcRenderer.removeListener(SLEvent.WINDOW_MAXIMIZED, () => updateMaxState(true));
      ipcRenderer.removeListener(SLEvent.WINDOW_UN_MAXIMIZED, () => updateMaxState(false));
    };
  }, []);

  const getMaximisedButtonIcon = isMaximized ? faWindowRestore : faWindowMaximize;

  return (
    <div className={styles.titleBar}>
      <p>
        <FontAwesomeIcon icon={faSuperpowers} size="sm" />
        &nbsp;Sliverload
      </p>
      <p>{tabTitle}</p>
      <div className={styles.titleBar}>
        <button className={styles.titleBarButton} onClick={() => ipcRenderer.send(SLEvent.MINIMIZE_WINDOW)}>
          <FontAwesomeIcon icon={faWindowMinimize} size="xs" />
        </button>
        <button className={styles.titleBarButton} onClick={() => ipcRenderer.send(SLEvent.MAXIMIZE_WINDOW)}>
          <FontAwesomeIcon icon={getMaximisedButtonIcon} size="xs" />
        </button>
        <button className={styles.titleBarCloseButton} onClick={() => ipcRenderer.send(SLEvent.CLOSE_WINDOW)}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
