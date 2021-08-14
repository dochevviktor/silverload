import styles from './DragAndDrop.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faSpinner } from '@fortawesome/free-solid-svg-icons';

const DragAndDrop = (): JSX.Element => {
  const showOverlay = useSelector((state: RootState) => state.dragEvent.showOverlay);
  const isLoading = useSelector((state: RootState) => state.tabsSlice.activeTab?.isLoading);

  return (
    <div className={styles.dragAndDropContainer}>
      {(showOverlay || isLoading) && (
        <div>
          <FontAwesomeIcon icon={isLoading ? faSpinner : faUpload} size="10x" spin={isLoading} />
        </div>
      )}
    </div>
  );
};

export default DragAndDrop;
