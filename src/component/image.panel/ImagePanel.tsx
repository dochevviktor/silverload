import React from 'react';
import styles from './ImagePanel.module.less';
import SLImage from '../../class/SLImage';

interface ImagePanelParams {
  image: SLImage | null;
}

const ImagePanel = (props: ImagePanelParams): JSX.Element => {
  return (
    <div className={styles.contentContainer}>
      <p>{props.image?.id}</p>
    </div>
  );
};

export default ImagePanel;
