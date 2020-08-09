import { Drawer } from 'antd';
import React, { RefObject, useState } from 'react';
import styles from './SLDrawer.module.less';

interface TabParams {
  imagePanelElement: RefObject<HTMLDivElement> | null;
}

const SLDrawer = (props: TabParams): JSX.Element => {
  const [isVisible, updateVisible] = useState(false);

  const showDrawer = () => {
    updateVisible(!isVisible);
  };

  const onClose = () => {
    updateVisible(false);
  };

  const drawerStyle = {
    ['backgroundColor' as string]: '#292d33',
  };

  const drawerButtonIcon = isVisible
    ? 'fas fa-grip-lines fa-lg'
    : 'fas fa-bars fa-lg';

  return (
    <div className="site-drawer-render-in-current-wrapper">
      <div className={styles.drawerButton}>
        <i className={drawerButtonIcon} onClick={showDrawer} />
      </div>
      <Drawer
        className={styles.drawerFrame}
        placement="left"
        closable={false}
        onClose={onClose}
        visible={isVisible}
        drawerStyle={drawerStyle}
        getContainer={props.imagePanelElement?.current ?? false}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </div>
  );
};

export default SLDrawer;
