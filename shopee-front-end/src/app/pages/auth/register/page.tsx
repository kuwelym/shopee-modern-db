'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './style.module.scss';
import Notification from '@/app/components/Notification';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setNotification({ message: 'Registration successful', type: 'success' });
        setTimeout(() => {
          router.push('/pages/auth/login');
        }, 1000);
      } else {
        setNotification({ message: data.message || 'Registration failed', type: 'error' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setNotification({ message: 'Registration failed', type: 'error' });
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
      <div className={styles.registerBox}>
        <h1 className={styles.title}>Register</h1>
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
          <button type="submit" className={styles.button}>
            Register
          </button>
        </form>
        <div className={styles.loginLink}>
          Already have an account?{' '}
          <Link href="/pages/auth/login" className={styles.link}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
} 
