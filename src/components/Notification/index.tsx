import React from "react";
import styles from './Notification.module.scss';

interface NotificationProps {
    notification: {
        content: string,
        time: string,
    }
  }

const Notification: React.FC<NotificationProps> = ({notification}) => {
    const {content, time} = notification;
    return (
        <div className={styles['container']}>
            <p className={styles['content']}>{content}</p>
            <p className={styles['time']}>{time}</p>
        </div>
    )
}

export default Notification;