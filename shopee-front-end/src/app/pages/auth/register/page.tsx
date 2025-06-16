'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './style.module.scss';

export default function Register() {
  const router = useRouter();

  const handleRegistrationTypeSelect = (type: 'buyer' | 'shop') => {
    router.push(`/pages/auth/register/${type}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <h1 className={styles.title}>Choose Registration Type</h1>
        <div className={styles.selectionContainer}>
          <div 
            className={styles.selectionCard}
            onClick={() => handleRegistrationTypeSelect('buyer')}
          >
            <div className={styles.cardIcon}>🛍️</div>
            <h2 className={styles.cardTitle}>Register as Buyer</h2>
            <p className={styles.cardDescription}>
              Shop from thousands of products and enjoy great deals
            </p>
          </div>
          
          <div 
            className={styles.selectionCard}
            onClick={() => handleRegistrationTypeSelect('shop')}
          >
            <div className={styles.cardIcon}>🏪</div>
            <h2 className={styles.cardTitle}>Register as Shop</h2>
            <p className={styles.cardDescription}>
              Start selling your products and grow your business
            </p>
          </div>
        </div>
        
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
