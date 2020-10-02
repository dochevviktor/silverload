import React, { useRef } from 'react';
import styles from './ImagePanel.module.less';
import DragAndDrop from './DropDown';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import { TabSlice } from '../../redux/slices/tab.slice';

const electron = window.require('electron');
const remote = electron.remote;
const fs = remote.require('fs');

const ImagePanel = (): JSX.Element => {
  const dropRef = useRef<HTMLDivElement>(null);

  const base64 = useSelector((state: RootState) => state.tabSlice.activeTab?.image.base64);

  const dispatch = useDispatch();

  const handleDrop = (files: FileList) => {
    if (!files[0].path) return;
    dispatch(TabSlice.actions.setActiveTabImage(fs.readFileSync(files[0].path).toString('base64')));
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
