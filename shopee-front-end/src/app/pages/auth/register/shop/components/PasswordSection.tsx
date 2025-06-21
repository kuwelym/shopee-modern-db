import { UseFormReturn } from 'react-hook-form';
import styles from '../../style.module.scss';
import { ShopRegistrationForm } from './types';

interface PasswordSectionProps {
  form: UseFormReturn<ShopRegistrationForm>;
}

export default function PasswordSection({ form }: PasswordSectionProps) {
  const { register, formState: { errors } } = form;

  return (
    <div>
      <h3 style={{ marginBottom: '16px', color: '#333', fontSize: '18px' }}>Security</h3>
      
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
    </div>
  );
} 
