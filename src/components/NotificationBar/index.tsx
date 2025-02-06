import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import Notication from '../Notification'
import styles from './NotificationBar.module.scss'; 

const notification = {
    content: "Lorem ipsum dolor  amet, consectetur adipiscing elit",
    time: '25m ago'
}

const NotificationBar = ({ isOpen, closeSidebar }) => {
    return (
        isOpen ?
        <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            <div className={styles['top-bar']}>
                <p className={styles['heading']}>Notifications</p>
               <FontAwesomeIcon icon={faXmark} onClick={closeSidebar} className={styles['cross-icon']} />
            </div>
            <div className={styles['notification-bar']}>
                <Notication notification={notification}/>
                <Notication notification={notification}/>
            </div>
        </div> : <></>
      );
  };
  
  export default NotificationBar;
