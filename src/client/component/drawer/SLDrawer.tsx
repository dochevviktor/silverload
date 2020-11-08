import { Drawer } from 'antd';
import React, { useState } from 'react';
import styles from './SLDrawer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripLines, faBars } from '@fortawesome/free-solid-svg-icons';
import 'antd/lib/drawer/style/css';

const SLDrawer = (): JSX.Element => {
  const [isVisible, updateVisible] = useState(false);

  const showDrawer = () => updateVisible(!isVisible);

  const onClose = () => updateVisible(false);

  const drawerButtonIcon = isVisible ? faGripLines : faBars;

  return (
    <div className="site-drawer-render-in-current-wrapper">
      <div className={styles.drawerButton} onClick={showDrawer}>
        <FontAwesomeIcon icon={drawerButtonIcon} size="lg" />
      </div>
      <Drawer className={styles.drawerFrame} placement="left" closable={false} onClose={onClose} visible={isVisible}>
        {/*<p>Some contents...</p>*/}
        {/*<p>Some contents...</p>*/}
        {/*<p>Some contents...</p>*/}
      </Drawer>
    </div>
  );
};

export default SLDrawer;
