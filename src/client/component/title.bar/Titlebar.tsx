import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowRestore, faWindowMaximize, faWindowMinimize, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faSuperpowers } from '@fortawesome/free-brands-svg-icons';
import styles from './Titlebar.scss';

const { ipcRenderer } = window.require('electron');

const TitleBar = (): JSX.Element => {
  const [isMaximized, updateMaxState] = useState(false);

  useEffect(() => {
    ipcRenderer.on('win-max', () => updateMaxState(true));
    ipcRenderer.on('win-umax', () => updateMaxState(false));

    return () => {
      ipcRenderer.removeListener('win-max', () => updateMaxState(true));
      ipcRenderer.removeListener('win-umax', () => updateMaxState(false));
    };
  }, []);

  const getMaximisedButtonIcon = isMaximized ? faWindowRestore : faWindowMaximize;

  return (
    <div className={styles.titleBar}>
      <p>
        <FontAwesomeIcon icon={faSuperpowers} size="sm" />
        &nbsp;Sliverload
      </p>
      <div className={styles.titleBar}>
        <button className={styles.titleBarButton} onClick={() => ipcRenderer.send('min-win')}>
          <FontAwesomeIcon icon={faWindowMinimize} size="xs" />
        </button>
        <button className={styles.titleBarButton} onClick={() => ipcRenderer.send('max-win')}>
          <FontAwesomeIcon icon={getMaximisedButtonIcon} size="xs" />
        </button>
        <button className={styles.titleBarCloseButton} onClick={() => ipcRenderer.send('quit-win')}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
