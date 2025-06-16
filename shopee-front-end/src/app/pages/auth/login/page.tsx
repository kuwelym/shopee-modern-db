'use client';

import Link from 'next/link';
import styles from './style.module.scss';
import Notification from '@/app/components/Notification';
import { useLogin } from '@/app/pages/auth/login/hooks';

export default function Login() {
  const { form, isLoading, notification, onSubmit, clearNotification } = useLogin();
  const { register, formState: { errors } } = form;

  return (
    <div className={styles.container}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={onSubmit} className={styles.form}>
          <div>
            <input
              type="text"
              placeholder="Username"
              {...register('username', { required: 'Username is required' })}
              className={styles.input}
            />
            {errors.username && (
              <span style={{ color: 'red', fontSize: '12px' }}>
                {errors.username.message}
              </span>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register('password', { required: 'Password is required' })}
              className={styles.input}
            />
            {errors.password && (
              <span style={{ color: 'red', fontSize: '12px' }}>
                {errors.password.message}
              </span>
            )}
          </div>
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
