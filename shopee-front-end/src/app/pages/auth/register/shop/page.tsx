'use client';

import Link from 'next/link';
import styles from '../style.module.scss';
import Notification from '@/app/components/Notification';
import { useShopRegister } from '@/app/pages/auth/register/shop/hooks';

export default function ShopRegister() {
  const { form, isLoading, notification, onSubmit, clearNotification } = useShopRegister();
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
        <h1 className={styles.title}>🏪 Register Your Shop</h1>
        <form onSubmit={onSubmit} className={styles.form}>
          {/* Basic Account Info */}
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
              type="tel"
              placeholder="Phone Number"
              {...register('phoneNumber')}
              className={styles.input}
            />
          </div>
          
          {/* Business Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <input
                type="text"
                placeholder="Business Name *"
                {...register('businessName', { required: 'Business name is required' })}
                className={styles.input}
              />
              {errors.businessName && (
                <span style={{ color: 'red', fontSize: '12px' }}>
                  {errors.businessName.message}
                </span>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Shop Name *"
                {...register('shopName', { required: 'Shop name is required' })}
                className={styles.input}
              />
              {errors.shopName && (
                <span style={{ color: 'red', fontSize: '12px' }}>
                  {errors.shopName.message}
                </span>
              )}
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <input
                type="text"
                placeholder="Tax Code *"
                {...register('taxCode', { 
                  required: 'Tax code is required',
                  minLength: {
                    value: 6,
                    message: 'Tax code must be at least 6 characters'
                  }
                })}
                className={styles.input}
              />
              {errors.taxCode && (
                <span style={{ color: 'red', fontSize: '12px' }}>
                  {errors.taxCode.message}
                </span>
              )}
            </div>
            <div>
              <select
                {...register('businessType')}
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
          </div>
          
          <div>
            <input
              type="text"
              placeholder="Business Address"
              {...register('businessAddress')}
              className={styles.input}
            />
          </div>
          
          <div>
            <textarea
              placeholder="Business Description (optional)"
              {...register('businessDescription')}
              className={styles.input}
              rows={3}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>
          
          {/* Password */}
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
