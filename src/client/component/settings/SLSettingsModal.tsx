import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { Modal, Switch } from 'antd';
import { loadSettings, saveSettings, toggleVisibility, toggleSetting } from '../../store/slices/settings.slice';
import styles from './SLSettingsModal.scss';

const SLSettingsModal = (): JSX.Element => {
  const isVisible = useSelector((state: RootState) => state.settingsModal.isVisible);
  const settings = useSelector((state: RootState) => state.settingsModal.settings);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadSettings());
  }, []);

  const handleOk = (): void => {
    dispatch(saveSettings(settings));
    dispatch(toggleVisibility());
  };

  const handleCancel = (): void => {
    dispatch(loadSettings());
    dispatch(toggleVisibility());
  };

  const toggleSet = (index: number): void => {
    dispatch(toggleSetting(index));
  };

  return (
    <Modal
      wrapClassName={styles.wrapStyle}
      title="Settings"
      visible={isVisible}
      onOk={handleOk}
      closable={false}
      maskClosable={false}
      cancelText="Back"
      okText="Save"
      onCancel={handleCancel}>
      {settings.map((setting, index) => (
        <div key={index} className={styles.setting}>
          <p>{setting.title}</p>
          <Switch checked={setting.flag} onClick={() => toggleSet(index)} />
        </div>
      ))}
    </Modal>
  );
};

export default SLSettingsModal;
