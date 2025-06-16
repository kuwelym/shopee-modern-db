'use client';

import Link from 'next/link';
import styles from '../style.module.scss';
import Notification from '@/app/components/Notification';
import { useBuyerRegister } from '@/app/pages/auth/register/buyer/hooks';

export default function BuyerRegister() {
  const { form, isLoading, notification, onSubmit, clearNotification } = useBuyerRegister();
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
      <div className={styles.registerBox}>
        <h1 className={styles.title}>🛍️ Register as Buyer</h1>
        <form onSubmit={onSubmit} className={styles.form}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <input
                type="text"
                placeholder="Username *"
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
                type="email"
                placeholder="Email *"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={styles.input}
              />
              {errors.email && (
                <span style={{ color: 'red', fontSize: '12px' }}>
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>
          
          <div>
            <input
              type="text"
              placeholder="Full Name"
              {...register('fullName')}
              className={styles.input}
            />
          </div>
          
          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              {...register('phoneNumber')}
              className={styles.input}
            />
          </div>
          
          <div>
            <input
              type="text"
              placeholder="Address"
              {...register('address')}
              className={styles.input}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <input
                type="password"
                placeholder="Password *"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className={styles.input}
              />
              {errors.password && (
                <span style={{ color: 'red', fontSize: '12px' }}>
                  {errors.password.message}
                </span>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm Password *"
                {...register('confirmPassword', { required: 'Please confirm your password' })}
                className={styles.input}
              />
              {errors.confirmPassword && (
                <span style={{ color: 'red', fontSize: '12px' }}>
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </div>
          
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register as Buyer'}
          </button>
        </form>
        
        <div className={styles.loginLink}>
          Already have an account?{' '}
          <Link href="/pages/auth/login" className={styles.link}>
            Login here
          </Link>
          <br />
          <Link href="/pages/auth/register" className={styles.link}>
            ← Back to registration options
          </Link>
        </div>
      </div>
    </div>
  );
} 
