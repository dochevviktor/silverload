import { Drawer, Button, Popover } from 'antd';
import { useState } from 'react';
import styles from './SLDrawer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretSquareLeft, faCaretSquareRight, faSave as faSaveReg } from '@fortawesome/free-regular-svg-icons';
import { faCog, faInfoCircle, faTrash, faSave as faSaveSol } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleVisibility } from '../../store/slices/settings.slice';
import { RootState } from '../../store/rootReducer';
import { load, save, deleteTabs } from '../../store/thunks/tab.thunk';

const SLDrawer = (): JSX.Element => {
  const [isVisible, updateVisible] = useState(false);

  const { tabList, isSaving } = useSelector((state: RootState) => state.tabsSlice);

  const drawerButtonIcon = isVisible ? faCaretSquareLeft : faCaretSquareRight;

  const dispatch = useDispatch();

  const showSettingsModal = () => dispatch(toggleVisibility());

  const content = (
    <div>
      <p>A thin and lite Image Browser app</p>
      <p>By Viktor Dochev</p>
    </div>
  );

  const buttonStyle = isSaving ? styles.buttonStyleProcessing : styles.buttonStyle;

  return (
    <div className="site-drawer-render-in-current-wrapper">
      <div className={styles.drawerButton} onClick={() => updateVisible(!isVisible)}>
        <FontAwesomeIcon icon={drawerButtonIcon} size="2x" />
      </div>
      <Drawer
        className={styles.drawerFrame}
        placement="left"
        closable={false}
        onClose={() => updateVisible(false)}
        visible={isVisible}
        width="170px">
        <div className={styles.topSection}>
          <Button type="text" onClick={() => dispatch(save(tabList))} loading={isSaving} className={buttonStyle} block>
            <FontAwesomeIcon icon={faSaveSol} size="lg" />
            <p>Save Tabs</p>
          </Button>
          <Button type="text" onClick={() => dispatch(load())} className={styles.buttonStyle} block>
            <FontAwesomeIcon icon={faSaveReg} size="lg" />
            <p>Load Tabs</p>
          </Button>
          <Button type="text" onClick={() => dispatch(deleteTabs())} className={styles.buttonStyle} block>
            <FontAwesomeIcon icon={faTrash} size="lg" />
            <p>Delete Tabs</p>
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
          <Button type="text" onClick={showSettingsModal} className={styles.buttonStyleAnimateSpin} block>
            <FontAwesomeIcon icon={faCog} size="lg" />
            <p>Settings</p>
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default SLDrawer;
