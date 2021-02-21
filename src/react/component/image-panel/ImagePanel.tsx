import { MouseEvent, useState, WheelEvent, DragEvent } from 'react';
import styles from './ImagePanel.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { v4 as uuid } from 'uuid';
import SLZoom from '../../class/SLZoom';
import VALID_FILE_TYPES from '../../../common/constant/SLImageFileTypes';
import DragAndDrop from '../image-drop/DragAndDrop';
import { handleDragIn, handleDragOut, handleDrag, handleDragDrop } from '../../store/slices/drag.slice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { changeImageSize, setActiveTabData, setImagePosition } from '../../store/slices/tab.slice';
import { addNewTab, requestImageData } from '../../store/thunks/tab.thunk';

const ImagePanel = (): JSX.Element => {
  const [isAnimated, setAnimated] = useState<boolean>(false);

  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.tabsSlice.activeTab);
  const isDragging = useSelector((state: RootState) => state.tabsSlice.isDragging);

  const zoom = new SLZoom((multiplier) => dispatch(changeImageSize(multiplier)));
  const validateFile = (file: File) => VALID_FILE_TYPES.indexOf(file.type) !== -1;

  const handleDrop = (e: DragEvent) => {
    dispatch(handleDragDrop(e));
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleDroppedFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDroppedFiles = (files: FileList) => {
    const { length, 0: firstDroppedFile, ...otherDroppedFiles } = files;

    if (!firstDroppedFile || !validateFile(firstDroppedFile)) return;

    dispatch(setActiveTabData({ title: firstDroppedFile.name, path: firstDroppedFile.path }));
    dispatch(requestImageData({ tabId: activeTab.id, path: firstDroppedFile.path }));

    if (length === 1) return;

    Object.values(otherDroppedFiles)
      .filter((it: File) => validateFile(it))
      .map((it: File) => dispatch(addNewTab({ id: uuid(), title: it.name, path: it.path })));
  };

  const onMouseMove = (e: MouseEvent) => {
    if (isDragging || e.button !== 0 || e.buttons !== 1) return;
    setAnimated(false);
    const newX = activeTab?.translateX + e.movementX / activeTab?.scaleX;
    const newY = activeTab?.translateY + e.movementY / activeTab?.scaleY;

    dispatch(setImagePosition({ translateX: newX, translateY: newY }));
    e.stopPropagation();
    e.preventDefault();
  };

  const onDoubleClick = (e: MouseEvent) => {
    dispatch(setImagePosition());
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

  const anim = isAnimated ? `transform 0.1s linear` : '';
  const transform = { transform: `${posX} ${posY} ${sclX} ${sclY}`, transition: anim };

  return (
    <div
      className={styles.contentContainer}
      onDoubleClick={onDoubleClick}
      onMouseLeave={onMouseLeave}
      onWheel={onWheel}
      onDragEnter={(e) => dispatch(handleDragIn(e))}
      onDragLeave={(e) => dispatch(handleDragOut(e))}
      onDragOver={(e) => dispatch(handleDrag(e))}
      onDrop={handleDrop}>
      <DragAndDrop />
      {activeTab?.base64Image ? (
        <div className={styles.imageContainer}>
          <img src={activeTab?.base64Image} alt="" style={transform} onMouseMove={onMouseMove} />
        </div>
      ) : (
        <div className={styles.dropMessage}>
          <FontAwesomeIcon icon={faUpload} />
          <p>Drag & Drop images here</p>
        </div>
      )}
    </div>
  );
};

export default ImagePanel;
