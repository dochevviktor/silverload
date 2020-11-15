import React, { MouseEvent, useRef, useState, WheelEvent, DragEvent } from 'react';
import styles from './ImagePanel.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/rootReducer';
import { TabListSlice } from '../../redux/slices/tab.slice';
import { v4 as uuid } from 'uuid';
import SLZoom from '../../class/SLZoom';
import VALID_FILE_TYPES from '../../constant/SLImageFileTypes';

const ImagePanel = (): JSX.Element => {
  const dropRef = useRef<HTMLDivElement>(null);
  const [isDragging, setDragging] = useState<boolean>(false);
  const [isAnimated, setAnimated] = useState<boolean>(false);

  let dragCounter = 0;

  const { actions } = TabListSlice;
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.tabsSlice.activeTab);

  const zoom = new SLZoom((multiplier) => dispatch(actions.changeImageSize(multiplier)));
  const validateFile = (file: File) => VALID_FILE_TYPES.indexOf(file.type) !== -1;

  const getBase64 = async (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      // TODO: add loading spinner on loadstart and remove it on loadend
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  };

  const handleDragOut = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter = 0;
    if (dragCounter === 0) {
      setDragging(false);
    }
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleDroppedFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
      dragCounter = 0;
    }
  };

  const handleDroppedFiles = async (files: FileList) => {
    const { length, 0: firstDroppedFile, ...otherDroppedFiles } = files;

    if (!firstDroppedFile || !validateFile(firstDroppedFile)) return;

    const result = await getBase64(firstDroppedFile);

    dispatch(actions.setActiveTabImage(result.toString()));
    dispatch(actions.setActiveTabTitle(firstDroppedFile.name));
    dispatch(actions.resetImageSizeAndPos());

    if (length === 1) return;

    Object.values(otherDroppedFiles)
      .filter((it) => validateFile(it))
      .map(async (it) => {
        const iteratedResult = await getBase64(it);

        dispatch(actions.addTab({ id: uuid(), title: it.name, base64Image: iteratedResult.toString() }));
      });
  };

  const onMouseMove = (e: MouseEvent) => {
    if (e.button !== 0 || e.buttons !== 1) return;
    setAnimated(false);
    const newX = activeTab?.translateX + e.movementX / activeTab?.scaleX;
    const newY = activeTab?.translateY + e.movementY / activeTab?.scaleY;

    dispatch(actions.setImagePosition({ translateX: newX, translateY: newY }));
    e.stopPropagation();
    e.preventDefault();
  };

  const onDoubleClick = (e: MouseEvent) => {
    dispatch(actions.resetImageSizeAndPos());
    e.stopPropagation();
    e.preventDefault();
  };

  const onMouseLeave = (e: MouseEvent) => {
    setAnimated(false);
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

  const imagePanelClassName = `${styles.contentContainer} ${isDragging ? styles.dragging : null}`;

  return (
    <div
      className={imagePanelClassName}
      ref={dropRef}
      onDoubleClick={onDoubleClick}
      onWheel={onWheel}
      onMouseLeave={onMouseLeave}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}>
      {!isDragging && activeTab?.base64Image ? (
        <div className={styles.imageContainer}>
          <img src={activeTab?.base64Image} alt="" style={transform} onMouseMove={onMouseMove} />
        </div>
      ) : (
        <div className={styles.dropMessage}>
          <p>Drag & Drop images here</p>
        </div>
      )}
    </div>
  );
};

export default ImagePanel;
