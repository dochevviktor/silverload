import React, { MouseEvent, useRef, useState, WheelEvent } from 'react';
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
  const [isDragging, setDragging] = useState<boolean>(false);
  const [isAnimated, setAnimated] = useState<boolean>(false);

  const base64 = useSelector((state: RootState) => state.tabsSlice.activeTab?.base64Image);
  const translateX = useSelector((state: RootState) => state.tabsSlice.activeTab?.translateX);
  const translateY = useSelector((state: RootState) => state.tabsSlice.activeTab?.translateY);
  const scaleX = useSelector((state: RootState) => state.tabsSlice.activeTab?.scaleX);
  const scaleY = useSelector((state: RootState) => state.tabsSlice.activeTab?.scaleY);

  const dispatch = useDispatch();

  const handleDrop = (files: SLFileList) => {
    if (!files[0].path) return;

    dispatch(TabListSlice.actions.setActiveTabImage(fs.readFileSync(files[0].path).toString('base64')));
    dispatch(TabListSlice.actions.setActiveTabTitle(files[0].name));
    dispatch(TabListSlice.actions.setImagePosition({ translateX: 0, translateY: 0 }));
    dispatch(TabListSlice.actions.resetImageSize());
    if (files.length > 1) {
      for (let i = 1; i < files.length; i++) {
        dispatch(
          TabListSlice.actions.addTab({
            id: newId(),
            title: files[i].name,
            base64Image: fs.readFileSync(files[i].path).toString('base64'),
            translateX: 0,
            translateY: 0,
            scaleX: 1,
            scaleY: 1,
          })
        );
      }
    }
  };

  // calculate relative position to the mouse and set dragging=true
  const onMouseDown = (e: MouseEvent) => {
    // only left mouse button
    setAnimated(false);
    if (e.button !== 0) return;

    setDragging(true);
    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseUp = (e: MouseEvent) => {
    setDragging(false);
    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const newX = translateX + e.movementX;
    const newY = translateY + e.movementY;

    dispatch(TabListSlice.actions.setImagePosition({ translateX: newX, translateY: newY }));
    e.stopPropagation();
    e.preventDefault();
  };

  const onDoubleClick = (e: MouseEvent) => {
    dispatch(TabListSlice.actions.setImagePosition({ translateX: 0, translateY: 0 }));
    dispatch(TabListSlice.actions.resetImageSize());
    e.stopPropagation();
    e.preventDefault();
  };

  const onWheel = async (e: WheelEvent) => {
    setAnimated(true);
    if (e.deltaY > 10) {
      if (scaleX > 0.05) dispatch(TabListSlice.actions.decreaseImageSize());
    } else {
      if (scaleX < 500) dispatch(TabListSlice.actions.increaseImageSize());
    }

    e.stopPropagation();
  };

  const imageSource = base64 ? 'data:image/png;base64,' + base64 : '';
  const posX = `translateX(${translateX}px)`;
  const posY = `translateY(${translateY}px)`;
  const sclX = `scaleX(${scaleX})`;
  const sclY = `scaleY(${scaleY})`;
  const anim = isAnimated ? `transform 0.2s ease` : '';
  const transform = { transform: `${posX} ${posY} ${sclX} ${sclY}`, transition: anim };

  return (
    <div className={styles.contentContainer} ref={dropRef} onDoubleClick={onDoubleClick} onWheel={onWheel}>
      <DragAndDrop handleDrop={handleDrop} dropRef={dropRef} />
      <div className={styles.imageContainer}>
        <img
          src={imageSource}
          alt=""
          style={transform}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        />
      </div>
    </div>
  );
};

export default ImagePanel;
