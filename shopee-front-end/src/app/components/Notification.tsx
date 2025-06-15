import { useEffect } from 'react';
import styles from './Notification.module.scss';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Notification({ message, type = 'info', onClose }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      <div className={styles.content}>
        <span className={styles.message}>{message}</span>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
    </div>
  );
} 
