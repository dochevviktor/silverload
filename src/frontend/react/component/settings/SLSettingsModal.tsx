import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Switch } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toggleVisibility, toggleSetting } from '../../store/slices/settings.slice';
import { RootState } from '../../store/rootReducer';
import { SLSetting } from '../../../../common/class/SLSettings';
import { loadSettings, saveSettings } from '../../store/thunks/settings.thunk';
import styles from './SLSettingsModal.scss';

const SLSettingsModal = (): JSX.Element => {
  const { isVisible, isSaving, settings } = useSelector((state: RootState) => state.settingsModal);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadSettings());
  }, []);

  const handleOk = (): void => {
    dispatch(saveSettings(settings));
  };

  const handleCancel = (): void => {
    dispatch(toggleVisibility());
    dispatch(loadSettings());
  };

  const toggleSet = (index: number): void => {
    dispatch(toggleSetting(index));
  };

  return (
    <Modal
      wrapClassName={styles.wrapStyle}
      title="Settings"
      visible={isVisible}
      destroyOnClose={true}
      onOk={handleOk}
      closable={false}
      confirmLoading={isSaving}
      maskClosable={false}
      cancelText="Back"
      okText="Save"
      onCancel={handleCancel}>
      {settings?.map((setting, index) => (
        <div key={index} className={styles.setting} onClick={() => toggleSet(index)}>
          <p>{SLSetting[setting.code]}</p>
          <Switch
            checked={!!setting.flag}
            checkedChildren={<FontAwesomeIcon icon={faCheck} />}
            unCheckedChildren={<FontAwesomeIcon icon={faTimes} color="silver" />}
          />
        </div>
      ))}
    </Modal>
  );
};

export default SLSettingsModal;
