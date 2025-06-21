import { UseFormReturn } from 'react-hook-form';
import styles from '../../style.module.scss';
import { ShopRegistrationForm, BUSINESS_TYPES } from './types';

interface BusinessInfoProps {
  form: UseFormReturn<ShopRegistrationForm>;
}

export default function BusinessInfo({ form }: BusinessInfoProps) {
  const { register, formState: { errors } } = form;

  return (
    <div>
      <h3 style={{ marginBottom: '16px', color: '#333', fontSize: '18px' }}>Business Information</h3>
      
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
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
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
            {BUSINESS_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div style={{ marginTop: '16px' }}>
        <input
          type="text"
          placeholder="Business Address"
          {...register('businessAddress')}
          className={styles.input}
        />
      </div>
      
      <div style={{ marginTop: '16px' }}>
        <textarea
          placeholder="Business Description (optional)"
          {...register('businessDescription')}
          className={styles.input}
          rows={3}
          style={{ resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>
    </div>
  );
} 
