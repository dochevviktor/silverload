import React, { useEffect } from 'react';
import styles from './Main.scss';
import Tabs from './tabs/Tabs';
import ImagePanel from './image.panel/ImagePanel';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/rootReducer';
import { SLFile } from '../../common/interface/SLFile';
import { v4 as uuid } from 'uuid';
import VALID_FILE_TYPES from '../constant/SLImageFileTypes';
import { addTabAndSetActive } from '../redux/slices/tab.slice';
import { SLEvent } from '../../common/constant/SLEvent';

const { ipcRenderer } = window.require('electron');

const Main = (): JSX.Element => {
  const validateFileMimeType = (type: string) => VALID_FILE_TYPES.indexOf(type) !== -1;
  const tabListSize = useSelector((state: RootState) => state.tabsSlice.tabList.length);
  const dispatch = useDispatch();

  useEffect(() => {
    openNewTabs(ipcRenderer.sendSync(SLEvent.GET_FILE_ARGUMENTS));
    ipcRenderer.on(SLEvent.SENT_FILE_ARGUMENTS, (event, fileList: SLFile[]) => openNewTabs(fileList));

    return () => {
      ipcRenderer.removeListener(SLEvent.SENT_FILE_ARGUMENTS, (event, fileList: SLFile[]) => openNewTabs(fileList));
    };
  }, []);

  const openNewTabs = (fileList: SLFile[]) => {
    Object.values(fileList)
      .filter((it) => validateFileMimeType(it.mimeType))
      .map((it) => dispatch(addTabAndSetActive({ id: uuid(), title: it.name, base64Image: it.base64 })));
  };

  return (
    <>
      <div className={styles.mainHeader}>
        <Tabs />
      </div>
      <div>{tabListSize > 0 ? <ImagePanel /> : null}</div>
    </>
  );
};

export default Main;
