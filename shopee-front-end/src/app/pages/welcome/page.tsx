'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './style.module.scss';

export default function Welcome() {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/pages/auth/login');
      return;
    }

    // Get username from token or API
    // For now, we'll just show a generic welcome
    setUsername('User');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/pages/auth/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.welcomeBox}>
        <h1 className={styles.title}>Welcome to Shopee!</h1>
        <p className={styles.message}>Hello, {username}! You have successfully logged in.</p>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
} 
