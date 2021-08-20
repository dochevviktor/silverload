import { MouseEvent, useMemo, useRef, useEffect } from 'react';
import styles from './Tab.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import SLTab from '../../../../../common/class/SLTab';
import {
  removeTab,
  resetDragPosition,
  setActiveTab,
  setDragPosition,
  setTabDragging,
  setTabNotDragging,
  setTabShiftLeft,
  setTabShiftRight,
  resetTabShift,
} from '../../../store/slices/tab.slice';
import { RootState } from '../../../store/rootReducer';

interface TabParams {
  tab: SLTab;
  position: number;
}

const Tab = (props: TabParams): JSX.Element => {
  const tabStyle = [styles.tabStyle];
  const tabRef = useRef(null);

  const dispatch = useDispatch();

  const activeTab = useSelector((state: RootState) => state.tabsSlice.activeTab);
  const dragPosition = useSelector((state: RootState) => state.tabsSlice.dragPosition);
  const dragDirection = useSelector((state: RootState) => state.tabsSlice.dragDirection);

  const isActiveTab = props.tab.id === activeTab?.id;
  const tabWidth = tabRef?.current ? tabRef.current.clientWidth + 4 : 1; //CSS margin incl.
  const tabShift = Math.round(dragPosition / tabWidth) + props.position;

  const remove = (event: MouseEvent) => {
    event.stopPropagation();
    dispatch(removeTab(props.position));
  };

  const onMouseMoveOutside = (event) => {
    if (tabRef) {
      dispatch(setDragPosition(event.movementX));
    }
  };

  const onMouseDown = (e) => {
    if (e.button !== 0) {
      return;
    }
    document.addEventListener('mousemove', onMouseMoveOutside);
    document.addEventListener('mouseup', onMouseUp);
    dispatch(setTabDragging(props.tab.id));
    dispatch(setActiveTab(props.tab));
  };

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMoveOutside);
    document.removeEventListener('mouseup', onMouseUp);
    dispatch(setTabNotDragging({ tab: props.tab, tabWidth }));
    dispatch(resetDragPosition());
  };

  if (isActiveTab) {
    tabStyle.push(styles.tabActive);
  }

  useEffect(() => {
    if (props.tab.isDragging) {
      if (tabShift > props.position && dragDirection < 0) {
        dispatch(setTabShiftRight(Array.from({ length: tabShift - props.position }, (_, i) => i + props.position + 1)));
      } else if (tabShift < props.position && dragDirection > 0) {
        dispatch(setTabShiftLeft(Array.from({ length: props.position - tabShift }, (_, i) => props.position - i - 1)));
      } else {
        if (dragDirection < 0) {
          dispatch(resetTabShift(Array.from({ length: props.position - tabShift + 1 }, (_, i) => props.position - i)));
        } else if (dragDirection > 0) {
          dispatch(resetTabShift(Array.from({ length: tabShift - props.position + 1 }, (_, i) => i + props.position)));
        }
      }
    }
  }, [props.tab.isDragging, tabShift]);

  let transform = null;

  if (props.tab.isDragging) {
    transform = { transform: `translateX(${dragPosition}px)`, zIndex: dragPosition > 0 ? 100 : 0 };
  } else if (props.tab.shiftLeft) {
    transform = { transform: `translateX(${tabWidth}px)` };
  } else if (props.tab.shiftRight) {
    transform = { transform: `translateX(-${tabWidth}px)` };
  }

  return useMemo(
    () => (
      <div ref={tabRef} className={tabStyle.join(' ')} style={transform} onMouseDown={onMouseDown}>
        <p>{props.tab.title}</p>
        <FontAwesomeIcon icon={props.tab.isLoading ? faSpinner : faTimes} onClick={remove} spin={props.tab.isLoading} />
      </div>
    ),
    [transform, props.tab.isLoading, props.tab.title, isActiveTab]
  );
};

export default Tab;
