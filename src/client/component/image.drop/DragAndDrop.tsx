import React from 'react';
import styles from './DragAndDrop.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/rootReducer';

const DragAndDrop = (): JSX.Element => {
  const showOverlay = useSelector((state: RootState) => state.dragEvent.showOverlay);

  return <div className={styles.dragAndDropContainer}>{showOverlay && <div />}</div>;
};

export default DragAndDrop;
