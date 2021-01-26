import { useEffect } from 'react';
import styles from './Main.scss';
import Tabs from './tabs/Tabs';
import ImagePanel from './image-panel/ImagePanel';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/rootReducer';
import { SLFile } from '../../common/interface/SLFile';
import { v4 as uuid } from 'uuid';
import VALID_FILE_TYPES from '../../common/constant/SLImageFileTypes';
import { addTabAndSetActive, addTab, loadTabImage } from '../store/slices/tab.slice';
import * as SLEvent from '../../common/class/SLEvent';
import SLSettingsModal from './settings/SLSettingsModal';

const { ipcRenderer } = window.require('electron');

const Main = (): JSX.Element => {
  const validateFileMimeType = (type: string) => VALID_FILE_TYPES.indexOf(type) !== -1;
  const tabListSize = useSelector((state: RootState) => state.tabsSlice.tabList.length);
  const fsHandlerId = useSelector((state: RootState) => state.tabsSlice.fsHandlerId);
  const dispatch = useDispatch();

  useEffect(() => {
    const removeList: (() => void)[] = [];

    SLEvent.GET_FILE_ARGUMENTS.sendTo(ipcRenderer, fsHandlerId);

    removeList.push(SLEvent.SEND_SL_FILES.on(ipcRenderer, (fileList) => openNewTabs(fileList)));
    removeList.push(SLEvent.LOAD_TAB_IMAGE.on(ipcRenderer, (tabImageData) => dispatch(loadTabImage(tabImageData))));

    return () => removeList.forEach((removeListener) => removeListener());
  }, []);

  const openNewTabs = (fileList: SLFile[]) => {
    const { length, 0: first, ...otherFiles } = fileList;

    if (!first || !validateFileMimeType(first.mimeType)) return;

    dispatch(addTabAndSetActive({ id: uuid(), title: first.name, path: first.path }));

    if (length === 1) return;

    Object.values(otherFiles)
      .filter((it) => validateFileMimeType(it.mimeType))
      .map((it) => dispatch(addTab({ id: uuid(), title: it.name, path: it.path })));
  };

  return (
    <>
      <div className={styles.mainHeader}>
        <Tabs />
      </div>
      <div>{tabListSize > 0 ? <ImagePanel /> : null}</div>
      <SLSettingsModal />
    </>
  );
};

export default Main;
