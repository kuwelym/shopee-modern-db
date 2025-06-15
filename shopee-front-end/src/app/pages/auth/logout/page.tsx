'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './style.module.scss';
import Notification from '@/app/components/Notification';

export default function Logout() {
  const router = useRouter();
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then(async (response) => {
          const data = await response.json();
          if (response.ok) {
            setNotification({ message: 'Logged out successfully', type: 'success' });
          } else {
            setNotification({ message: data.message || 'Logout failed', type: 'error' });
          }
        })
        .catch(() => {
          setNotification({ message: 'Logout failed', type: 'error' });
        })
        .finally(() => {
          localStorage.removeItem('token');
          setTimeout(() => {
            router.push('/auth/login');
          }, 1000);
        });
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  return (
    <div className={styles.container}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div>Logging out...</div>
    </div>
  );
} 
