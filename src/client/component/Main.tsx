import React, { useEffect } from 'react';
import styles from './Main.scss';
import Tabs from './tabs/Tabs';
import ImagePanel from './image.panel/ImagePanel';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/rootReducer';
import SLFile from '../interface/SLFile';
import { v4 as uuid } from 'uuid';
import VALID_FILE_TYPES from '../constant/SLImageFileTypes';
import { TabListSlice } from '../redux/slices/tab.slice';

const { ipcRenderer } = window.require('electron');

const Main = (): JSX.Element => {
  const validateFileMimeType = (type: string) => VALID_FILE_TYPES.indexOf(type) !== -1;
  const tabListSize = useSelector((state: RootState) => state.tabsSlice.tabList.length);
  const dispatch = useDispatch();

  useEffect(() => {
    openNewTabs(ipcRenderer.sendSync('get-args'));
    ipcRenderer.on('sec-args', (event, fileList: SLFile[]) => openNewTabs(fileList));

    return () => {
      ipcRenderer.removeListener('sec-args', (event, fileList: SLFile[]) => openNewTabs(fileList));
    };
  }, []);

  const openNewTabs = (fileList: SLFile[]) => {
    Object.values(fileList)
      .filter((it) => validateFileMimeType(it.mimeType))
      .map((it) =>
        dispatch(TabListSlice.actions.addTabAndSetActive({ id: uuid(), title: it.name, base64Image: it.base64 }))
      );
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
