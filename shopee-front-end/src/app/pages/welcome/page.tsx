'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './style.module.scss';
import { useAuth } from '@/app/contexts/AuthContext';

export default function Welcome() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/pages/auth/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/pages/auth/login');
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.welcomeBox}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className={styles.container}>
      <div className={styles.welcomeBox}>
        <h1 className={styles.title}>Welcome to Shopee!</h1>
        <p className={styles.message}>
          Hello, {user.username}! You are logged in as a <strong>{user.userType.toLowerCase()}</strong>.
        </p>
        <div className={styles.userInfo}>
          <div className={styles.userBadge}>
            {user.userType === 'BUYER' ? '🛍️' : '🏪'} {user.userType}
          </div>
        </div>
        
        <div className={styles.actions}>
          {user.userType === 'BUYER' ? (
            <button 
              onClick={() => router.push('/pages/products')}
              className={styles.primaryButton}
            >
              Browse Products 🛍️
            </button>
          ) : (
            <button 
              onClick={() => router.push('/pages/shop/products')}
              className={styles.primaryButton}
            >
              Manage Products 🏪
            </button>
          )}
          
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 
