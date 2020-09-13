import React, { MouseEvent } from 'react';
import styles from './Tab.module.less';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

interface TabParams {
  id: number;
  active: boolean;
  position: number;
  click: (event: MouseEvent) => void;
  title: string;
  close: (event: MouseEvent) => void;
}

const Tab = (props: TabParams): JSX.Element => {
  const tabStyle = [styles.tabStyle];

  if (props.active) {
    tabStyle.push(styles.tabActive);
  }

  return (
    <div className={tabStyle.join(' ')} onClick={props.click}>
      <p>{props.title}</p>
      <FontAwesomeIcon icon={faTimesCircle} size="lg" onClick={props.close} />
    </div>
  );
};

export default Tab;
