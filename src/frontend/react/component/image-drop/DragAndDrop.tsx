import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Progress } from 'antd';
import { RootState } from '../../store/rootReducer';
import styles from './DragAndDrop.scss';

const DragAndDrop = (): JSX.Element => {
  const showOverlay = useSelector((state: RootState) => state.dragEvent.showOverlay);
  const isLoading = useSelector((state: RootState) => state.tabsSlice.activeTab?.isLoading);
  const loadingProgress = useSelector((state: RootState) => state.tabsSlice.activeTab?.loadingProgress);

  const spinner = <FontAwesomeIcon icon={isLoading ? faSpinner : faUpload} size="10x" spin={isLoading} />;
  const progress = <Progress className={styles.progress} strokeColor="silver" type="circle" percent={loadingProgress} />;

  return (
    <div className={styles.dragAndDropContainer}>
      {(showOverlay || isLoading) && <div>{loadingProgress ? progress : spinner}</div>}
    </div>
  );
};

export default DragAndDrop;
