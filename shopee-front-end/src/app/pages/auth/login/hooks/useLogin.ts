import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/app/contexts/AuthContext';

interface LoginForm {
  username: string;
  password: string;
}

export function useLogin() {
  const router = useRouter();
  const { login, isLoading: authLoading } = useAuth();
  const [notification, setNotification] = useState<{ 
    message: string; 
    type: 'success' | 'error' | 'info' 
  } | null>(null);

  const form = useForm<LoginForm>({
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onChange'
  });

  const { handleSubmit, formState: { isSubmitting } } = form;

  const onSubmit = useCallback(async (data: LoginForm) => {
    try {
      await login(data.username, data.password);
      setNotification({ 
        message: 'Login successful!', 
        type: 'success' 
      });
      
      // Redirect after successful login
      setTimeout(() => {
        router.push('/pages/welcome');
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setNotification({ 
        message: errorMessage, 
        type: 'error' 
      });
    }
  }, [login, router]);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return {
    form,
    isLoading: authLoading || isSubmitting,
    notification,
    onSubmit: handleSubmit(onSubmit),
    clearNotification,
  };
} 
