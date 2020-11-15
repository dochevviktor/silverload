import React, { MouseEvent, useRef, useState, WheelEvent } from 'react';
import styles from './ImagePanel.scss';
import DragAndDrop from './DropDown';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import { TabListSlice } from '../../redux/slices/tab.slice';
import { v4 as uuid } from 'uuid';
import SLConstants from '../../class/SLConstants';
import SLZoom from '../../class/SLZoom';

const ImagePanel = (): JSX.Element => {
  const dropRef = useRef<HTMLDivElement>(null);
  const [isDragging, setDragging] = useState<boolean>(false);
  const [isAnimated, setAnimated] = useState<boolean>(false);

  const activeTab = useSelector((state: RootState) => state.tabsSlice.activeTab);
  const dispatch = useDispatch();
  const actions = TabListSlice.actions;

  const zoom = new SLZoom((multiplier) => dispatch(TabListSlice.actions.changeImageSize(multiplier)));
  const validateFile = (file: File) => SLConstants.VALID_FILE_TYPES.indexOf(file.type) !== -1;

  const getBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      // TODO: add loading spinner on loadstart and remove it on loadend
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleDrop = (files: FileList) => {
    if (!files[0].path || !validateFile(files[0])) return;
    getBase64(files[0]).then((result) => {
      dispatch(actions.setActiveTabImage(result.toString()));
      dispatch(actions.setActiveTabTitle(files[0].name));
      dispatch(actions.resetImageSizeAndPos());
    });

    if (files.length > 1) {
      for (let i = 1; i < files.length; i++) {
        if (validateFile(files[i])) {
          getBase64(files[i]).then((result) => {
            dispatch(actions.addTab({ id: uuid(), title: files[i].name, base64Image: result.toString() }));
          });
        }
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
    setAnimated(false);
    setDragging(false);
    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const newX = activeTab?.translateX + e.movementX / activeTab?.scaleX;
    const newY = activeTab?.translateY + e.movementY / activeTab?.scaleY;

    dispatch(TabListSlice.actions.setImagePosition({ translateX: newX, translateY: newY }));
    e.stopPropagation();
    e.preventDefault();
  };

  const onDoubleClick = (e: MouseEvent) => {
    dispatch(TabListSlice.actions.resetImageSizeAndPos());
    e.stopPropagation();
    e.preventDefault();
  };

  const onWheel = async (e: WheelEvent) => {
    setAnimated(true);
    if (e.deltaY > 0) {
      if (activeTab?.scaleX > 0.05) await zoom.zoom(false);
    } else {
      if (activeTab?.scaleX < 500) await zoom.zoom(true);
    }

    e.stopPropagation();
  };

  const posX = `translateX(${activeTab?.translateX * activeTab?.scaleX}px)`;
  const posY = `translateY(${activeTab?.translateY * activeTab?.scaleY}px)`;
  const sclX = `scaleX(${activeTab?.scaleX})`;
  const sclY = `scaleY(${activeTab?.scaleY})`;

  const anim = isAnimated ? `transform 0.2s ease` : '';
  const transform = { transform: `${posX} ${posY} ${sclX} ${sclY}`, transition: anim };

  return (
    <div className={styles.contentContainer} ref={dropRef} onDoubleClick={onDoubleClick} onWheel={onWheel}>
      <DragAndDrop handleDrop={handleDrop} dropRef={dropRef} />
      <div className={styles.imageContainer}>
        <img
          src={activeTab?.base64Image}
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
