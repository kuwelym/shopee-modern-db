'use client';

import Link from 'next/link';
import styles from '../style.module.scss';
import Notification from '@/app/components/Notification';
import { useShopRegister } from '@/app/pages/auth/register/shop/hooks';
import { BasicAccountInfo, BusinessInfo, PasswordSection } from './components';

export default function ShopRegister() {
  const { form, isLoading, notification, onSubmit, clearNotification } = useShopRegister();

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
        <h1 className={styles.title}>🏪 Register Your Shop</h1>
        <form onSubmit={onSubmit} className={styles.form}>
          <BasicAccountInfo form={form} />
          <div style={{ marginTop: '24px' }}>
            <BusinessInfo form={form} />
          </div>
          <div style={{ marginTop: '24px' }}>
            <PasswordSection form={form} />
          </div>
          
          <button type="submit" className={styles.button} disabled={isLoading} style={{ marginTop: '24px' }}>
            {isLoading ? 'Registering Shop...' : 'Register Shop'}
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
