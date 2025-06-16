'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './style.module.scss';
import Notification from '@/app/components/Notification';
import { useAuth } from '@/app/contexts/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      setNotification({ message: 'Login successful!', type: 'success' });
      setTimeout(() => {
        router.push('/pages/welcome');
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      setNotification({ 
        message: error instanceof Error ? error.message : 'Login failed', 
        type: 'error' 
      });
    }
  };

  return (
    <div className={styles.container}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className={styles.registerLink}>
          Don&apos;t have an account?{' '}
          <Link href="/pages/auth/register" className={styles.link}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
} 
