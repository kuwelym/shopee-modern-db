import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { apiService } from '@/app/services/api';
import { BuyerRegistrationRequest } from '@/app/types/auth';

interface BuyerRegistrationForm extends BuyerRegistrationRequest {
  confirmPassword: string;
}

export function useBuyerRegister() {
  const router = useRouter();
  const [notification, setNotification] = useState<{ 
    message: string; 
    type: 'success' | 'error' | 'info' 
  } | null>(null);

  const form = useForm<BuyerRegistrationForm>({
    defaultValues: {
      username: '',
      password: '',
      email: '',
      phoneNumber: '',
      fullName: '',
      address: '',
      confirmPassword: '',
    },
    mode: 'onChange'
  });

  const { handleSubmit, formState: { isSubmitting } } = form;

  const onSubmit = useCallback(async (data: BuyerRegistrationForm) => {
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      form.setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match'
      });
      return;
    }

    // Validate password length
    if (data.password.length < 6) {
      form.setError('password', {
        type: 'manual',
        message: 'Password must be at least 6 characters'
      });
      return;
    }

    try {
      const { ...registrationData } = data;
      
      const response = await apiService.registerBuyer(registrationData);
      
      if (response.success) {
        setNotification({ 
          message: 'Registration successful! Redirecting to login...', 
          type: 'success' 
        });
        
        // Redirect after successful registration
        setTimeout(() => {
          router.push('/pages/auth/login');
        }, 2000);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setNotification({ 
        message: errorMessage, 
        type: 'error' 
      });
    }
  }, [form, router]);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return {
    form,
    isLoading: isSubmitting,
    notification,
    onSubmit: handleSubmit(onSubmit),
    clearNotification,
  };
} 
