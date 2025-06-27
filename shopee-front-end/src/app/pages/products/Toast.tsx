import React from 'react';
import styles from './Notification.module.scss';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={type === 'success' ? styles.toastSuccess : styles.toastError}>
      {message}
      <button onClick={onClose} className={styles.toastClose}>×</button>
    </div>
  );
}
