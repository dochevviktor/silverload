import { useRef, WheelEvent } from 'react';
import styles from './Tabs.scss';
import Tab from './tab/Tab';
import SLScroll from '../../class/SLScroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { addTabAndSetActive } from '../../store/slices/tab.slice';
import SLDrawer from '../drawer/SLDrawer';

const Tabs = (): JSX.Element => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = new SLScroll(scrollRef?.current);

  const tabs = useSelector((state: RootState) => state.tabsSlice.tabList);

  const dispatch = useDispatch();

  const addTab = () => {
    dispatch(addTabAndSetActive());

    return scroll.scrollLeft(100, 10);
  };

  const smoothScroll = async (left: number) => {
    return requestAnimationFrame(() => scroll.scrollLeft(left));
  };

  return (
    <div className={styles.tabsContainer}>
      <SLDrawer />
      <div ref={scrollRef} className={styles.tabsStyle} onWheel={(event: WheelEvent) => smoothScroll(event.deltaY)}>
        {tabs.map((tab, index) => (
          <Tab tab={tab} position={index} key={tab.id} />
        ))}
        <FontAwesomeIcon icon={faPlus} size="2x" onClick={addTab} />
      </div>
    </div>
  );
};

export default Tabs;
