import { Drawer, Button, Popover } from 'antd';
import { useState } from 'react';
import styles from './SLDrawer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretSquareLeft, faCaretSquareRight } from '@fortawesome/free-regular-svg-icons';
import { faCog, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { toggleVisibility } from '../../store/slices/settings.slice';

const SLDrawer = (): JSX.Element => {
  const [isVisible, updateVisible] = useState(false);

  const showDrawer = () => updateVisible(!isVisible);

  const onClose = () => updateVisible(false);

  const drawerButtonIcon = isVisible ? faCaretSquareLeft : faCaretSquareRight;

  const dispatch = useDispatch();

  const showSettingsModal = () => dispatch(toggleVisibility());

  const content = (
    <div>
      <p>A thin and lite Image Browser app</p>
      <p>By Viktor Dochev</p>
    </div>
  );

  return (
    <div className="site-drawer-render-in-current-wrapper">
      <div className={styles.drawerButton} onClick={showDrawer}>
        <FontAwesomeIcon icon={drawerButtonIcon} size="2x" />
      </div>
      <Drawer
        className={styles.drawerFrame}
        placement="left"
        closable={false}
        onClose={onClose}
        visible={isVisible}
        width="170px">
        <div className={styles.topSection}>
          <Button type="text" onClick={showSettingsModal} className={styles.buttonStyleAnimateSpin} block>
            <FontAwesomeIcon icon={faCog} size="lg" />
            <p>Settings</p>
          </Button>
        </div>
        <div className={styles.bottomSection}>
          <Popover
            placement="rightBottom"
            color="#36393f"
            overlayClassName={styles.tooltip}
            content={content}
            title="Project Silverload"
            trigger="click">
            <Button type="text" className={styles.buttonStyle} block>
              <FontAwesomeIcon icon={faInfoCircle} size="lg" />
              <p>About</p>
            </Button>
          </Popover>
        </div>
      </Drawer>
    </div>
  );
};

export default SLDrawer;
