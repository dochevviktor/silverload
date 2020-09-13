import { Drawer } from 'antd';
import React, { RefObject, useState } from 'react';
import styles from './SLDrawer.module.less';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripLines, faBars } from '@fortawesome/free-solid-svg-icons';

interface TabParams {
  imagePanelElement: RefObject<HTMLDivElement> | null;
}

const SLDrawer = (props: TabParams): JSX.Element => {
  const [isVisible, updateVisible] = useState(false);

  const showDrawer = () => updateVisible(!isVisible);

  const onClose = () => updateVisible(false);

  const drawerStyle = { ['backgroundColor' as string]: '#292d33' };

  const drawerButtonIcon = isVisible ? faGripLines : faBars;

  return (
    <div className="site-drawer-render-in-current-wrapper">
      <div className={styles.drawerButton} onClick={showDrawer}>
        <FontAwesomeIcon icon={drawerButtonIcon} size="lg" />
      </div>
      <Drawer
        className={styles.drawerFrame}
        placement="left"
        closable={false}
        onClose={onClose}
        visible={isVisible}
        drawerStyle={drawerStyle}
        getContainer={props.imagePanelElement?.current ?? false}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </div>
  );
};

export default SLDrawer;
