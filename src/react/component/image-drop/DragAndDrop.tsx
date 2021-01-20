import styles from './DragAndDrop.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

const DragAndDrop = (): JSX.Element => {
  const showOverlay = useSelector((state: RootState) => state.dragEvent.showOverlay);

  return (
    <div className={styles.dragAndDropContainer}>
      {showOverlay && (
        <div>
          <FontAwesomeIcon icon={faUpload} size="10x" />
        </div>
      )}
    </div>
  );
};

export default DragAndDrop;
