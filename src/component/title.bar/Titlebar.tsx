import React, { useState, useEffect } from 'react';
import styles from './Titlebar.module.less';

const electron = window.require('electron');
const remote = electron.remote;
const win = remote.getCurrentWindow();

const TitleBar = (): JSX.Element => {
  const [isMaximized, updateMaxState] = useState(win.isMaximized());

  const setMaximised = () => updateMaxState(win.isMaximized());

  const toggleMaximised = () =>
    win.isMaximized() ? win.unmaximize() : win.maximize();

  useEffect(() => {
    win.addListener('maximize', setMaximised);
    win.addListener('unmaximize', setMaximised);
    return () => {
      win.removeListener('maximize', setMaximised);
      win.removeListener('unmaximize', setMaximised);
    };
  }, []);

  const getMaximisedButtonIcon = isMaximized
    ? 'far fa-window-restore fa-xs'
    : 'far fa-window-maximize fa-xs';

  return (
    <div className={styles.titleBar}>
      <p>
        <i className="fab fa-superpowers fa-sm" />
        &nbsp;Sliverload
      </p>
      <div className={styles.titleBar}>
        <button
          className={styles.titleBarButton}
          onClick={() => win.minimize()}
        >
          <i className="fas fa-window-minimize fa-xs" />
        </button>
        <button className={styles.titleBarButton} onClick={toggleMaximised}>
          <i className={getMaximisedButtonIcon} />
        </button>
        <button
          className={styles.titleBarCloseButton}
          onClick={() => win.close()}
        >
          <i className="fas fa-times" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;
