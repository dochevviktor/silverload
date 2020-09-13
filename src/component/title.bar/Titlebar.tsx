import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowRestore, faWindowMaximize, faWindowMinimize, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faSuperpowers } from '@fortawesome/free-brands-svg-icons';
import styles from './Titlebar.module.less';

const electron = window.require('electron');
const remote = electron.remote;
const win = remote.getCurrentWindow();

const TitleBar = (): JSX.Element => {
  const [isMaximized, updateMaxState] = useState(win.isMaximized());

  const setMaximised = () => updateMaxState(win.isMaximized());

  const toggleMaximised = () => (win.isMaximized() ? win.unmaximize() : win.maximize());

  useEffect(() => {
    win.addListener('maximize', setMaximised);
    win.addListener('unmaximize', setMaximised);

    return () => {
      win.removeListener('maximize', setMaximised);
      win.removeListener('unmaximize', setMaximised);
    };
  }, []);

  const getMaximisedButtonIcon = isMaximized ? faWindowRestore : faWindowMaximize;

  return (
    <div className={styles.titleBar}>
      <p>
        <i className="fab fa-superpowers fa-sm" />
        &nbsp;Sliverload
      </p>
      <div className={styles.titleBar}>
        <button className={styles.titleBarButton} onClick={() => win.minimize()}>
          <FontAwesomeIcon icon={faWindowMinimize} size="xs" />
        </button>
        <button className={styles.titleBarButton} onClick={toggleMaximised}>
          <FontAwesomeIcon icon={getMaximisedButtonIcon} size="xs" />
        </button>
        <button className={styles.titleBarCloseButton} onClick={() => win.close()}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
