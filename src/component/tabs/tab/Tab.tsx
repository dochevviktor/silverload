import React, {MouseEvent} from 'react';
import styles from './Tab.module.css';

interface TabParams {
    id: number
    active: boolean;
    position: number
    click: ((event: MouseEvent) => void) | undefined;
    title: string;
    close: ((event: MouseEvent) => void) | undefined
}

const tab = (props: TabParams) => {

  const tabCloseButtonClass = `fas fa-times-circle ${styles.tabCloseButton}`;
  const tabStyle = [styles.tabStyle];

  if(props.active) {
    tabStyle.push(styles.tabActive);
  }

  return (
    <div className={tabStyle.join(' ')} onClick={props.click}>
      <p>{props.title}</p>
      <i className={tabCloseButtonClass} onClick={props.close}/>
    </div>
  );
};

export default tab;
