'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../style.module.scss';
import Notification from '@/app/components/Notification';
import { apiService } from '@/app/services/api';
import { BuyerRegistrationRequest } from '@/app/types/auth';

export default function BuyerRegister() {
  const [formData, setFormData] = useState<BuyerRegistrationRequest>({
    username: '',
    password: '',
    email: '',
    phoneNumber: '',
    fullName: '',
    address: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== confirmPassword) {
      setNotification({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    if (formData.password.length < 6) {
      setNotification({ message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.registerBuyer(formData);
      
      if (response.success) {
        setNotification({ message: 'Registration successful! Redirecting to login...', type: 'success' });
        setTimeout(() => {
          router.push('/pages/auth/login');
        }, 2000);
      } else {
        setNotification({ message: response.message || 'Registration failed', type: 'error' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setNotification({ 
        message: error instanceof Error ? error.message : 'Registration failed', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
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
        <h1 className={styles.title}>🛍️ Register as Buyer</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <input
              type="text"
              name="username"
              placeholder="Username *"
              value={formData.username}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>
          
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleInputChange}
            className={styles.input}
          />
          
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className={styles.input}
          />
          
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
            className={styles.input}
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <input
              type="password"
              name="password"
              placeholder="Password *"
              value={formData.password}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password *"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              required
            />
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
