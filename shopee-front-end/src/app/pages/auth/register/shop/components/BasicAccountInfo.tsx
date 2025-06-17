import { UseFormReturn } from 'react-hook-form';
import styles from '../style.module.scss';
import { ShopRegistrationForm } from './types';

interface BasicAccountInfoProps {
  form: UseFormReturn<ShopRegistrationForm>;
}

export default function BasicAccountInfo({ form }: BasicAccountInfoProps) {
  const { register, formState: { errors } } = form;

  return (
    <div>
      <h3 style={{ marginBottom: '16px', color: '#333', fontSize: '18px' }}>Account Information</h3>
      
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
      
      <div style={{ marginTop: '16px' }}>
        <input
          type="tel"
          placeholder="Phone Number"
          {...register('phoneNumber')}
          className={styles.input}
        />
      </div>
    </div>
  );
} 
