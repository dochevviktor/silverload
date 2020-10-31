import React, { useRef } from 'react';
import styles from './ImagePanel.scss';
import DragAndDrop from './DropDown';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import { TabListSlice } from '../../redux/slices/tab.slice';
import newId from '../../function/SLRandom';
import SLFileList from '../../interface/SLFileList';

const electron = window.require('electron');
const remote = electron.remote;
const fs = remote.require('fs');

const ImagePanel = (): JSX.Element => {
  const dropRef = useRef<HTMLDivElement>(null);

  const base64 = useSelector((state: RootState) => state.tabsSlice.activeTab?.base64Image);

  const dispatch = useDispatch();

  const handleDrop = (files: SLFileList) => {
    if (!files[0].path) return;

    dispatch(TabListSlice.actions.setActiveTabImage(fs.readFileSync(files[0].path).toString('base64')));
    dispatch(TabListSlice.actions.setActiveTabTitle(files[0].name));

    if (files.length > 1) {
      for (let i = 1; i < files.length; i++) {
        dispatch(
          TabListSlice.actions.addTab({
            id: newId(),
            title: files[i].name,
            base64Image: fs.readFileSync(files[i].path).toString('base64'),
          })
        );
      }
    }
  };

  const imageSource = base64 ? 'data:image/png;base64,' + base64 : '';

  return (
    <div className={styles.contentContainer} ref={dropRef}>
      <DragAndDrop handleDrop={handleDrop} dropRef={dropRef} />
      <img src={imageSource} alt="" />
    </div>
  );
};

export default ImagePanel;
