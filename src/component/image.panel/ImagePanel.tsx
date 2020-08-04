import React, {useState} from 'react';
import {Drawer, Button} from 'antd';
import styles from './ImagePanel.module.less';

const ImagePanel = () => {


  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <div className={styles.contentContainer}>
      {/*<>*/}
      {/*  <Button type="primary" onClick={showDrawer}>*/}
      {/*    Open*/}
      {/*  </Button>*/}
      {/*  <Drawer*/}
      {/*    title="Basic Drawer"*/}
      {/*    placement="right"*/}
      {/*    closable={false}*/}
      {/*    onClose={onClose}*/}
      {/*    visible={visible}>*/}
      {/*  </Drawer>*/}
      {/*</>*/}

    </div>
  );
};

export default ImagePanel;