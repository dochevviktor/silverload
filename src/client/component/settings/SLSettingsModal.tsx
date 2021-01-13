import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { Modal, Switch } from 'antd';
import { saveSettings, toggleVisibility, toggleSetting } from '../../store/slices/settings.slice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SLSetting } from '../../../common/class/SLSettings';
import styles from './SLSettingsModal.scss';
import { load } from '../../store/thunks/settings.thunk';

const SLSettingsModal = (): JSX.Element => {
  const isVisible = useSelector((state: RootState) => state.settingsModal.isVisible);
  const settings = useSelector((state: RootState) => state.settingsModal.settings);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(load());
  }, []);

  const handleOk = (): void => {
    dispatch(saveSettings(settings));
    dispatch(toggleVisibility());
  };

  const handleCancel = (): void => {
    dispatch(toggleVisibility());
    dispatch(load());
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
      {settings?.map((setting, index) => (
        <div key={index} className={styles.setting} onClick={() => toggleSet(index)}>
          <p>{SLSetting[setting.code]}</p>
          <Switch
            checked={setting.flag}
            checkedChildren={<FontAwesomeIcon icon={faCheck} />}
            unCheckedChildren={<FontAwesomeIcon icon={faTimes} color="silver" />}
          />
        </div>
      ))}
    </Modal>
  );
};

export default SLSettingsModal;
