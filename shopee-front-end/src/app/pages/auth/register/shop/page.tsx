'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../style.module.scss';
import Notification from '@/app/components/Notification';
import { apiService } from '@/app/services/api';
import { ShopRegistrationRequest } from '@/app/types/auth';

export default function ShopRegister() {
  const [formData, setFormData] = useState<ShopRegistrationRequest>({
    username: '',
    password: '',
    email: '',
    phoneNumber: '',
    businessName: '',
    shopName: '',
    taxCode: '',
    businessAddress: '',
    businessDescription: '',
    businessType: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

    if (formData.taxCode.length < 6) {
      setNotification({ message: 'Tax code must be at least 6 characters', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.registerShop(formData);
      
      if (response.success) {
        setNotification({ message: 'Shop registration successful! Redirecting to login...', type: 'success' });
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
        <h1 className={styles.title}>🏪 Register Your Shop</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Basic Account Info */}
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
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className={styles.input}
          />
          
          {/* Business Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <input
              type="text"
              name="businessName"
              placeholder="Business Name *"
              value={formData.businessName}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
            <input
              type="text"
              name="shopName"
              placeholder="Shop Name *"
              value={formData.shopName}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <input
              type="text"
              name="taxCode"
              placeholder="Tax Code *"
              value={formData.taxCode}
              onChange={handleInputChange}
              className={styles.input}
              required
            />
            <select
              name="businessType"
              value={formData.businessType}
              onChange={handleInputChange}
              className={styles.input}
            >
              <option value="">Select Business Type</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Sports & Outdoor">Sports & Outdoor</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Books & Media">Books & Media</option>
              <option value="Food & Beverages">Food & Beverages</option>
              <option value="Automotive">Automotive</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <input
            type="text"
            name="businessAddress"
            placeholder="Business Address"
            value={formData.businessAddress}
            onChange={handleInputChange}
            className={styles.input}
          />
          
          <textarea
            name="businessDescription"
            placeholder="Business Description (optional)"
            value={formData.businessDescription}
            onChange={handleInputChange}
            className={styles.input}
            rows={3}
            style={{ resize: 'vertical', fontFamily: 'inherit' }}
          />
          
          {/* Password */}
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
