'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types/auth';
import { apiService } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = apiService.getAuthToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userData: User = {
          username: payload.sub || '',
          userType: payload.userType || 'BUYER',
          token,
        };
        setUser(userData);
      } catch (error) {
        console.error('Error parsing token:', error);
        apiService.clearAuthToken();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.login({ username, password });
      
      if (response.success && response.data) {
        const { token, userType, username: userUsername } = response.data;
        
        apiService.setAuthToken(token);
        
        const userData: User = {
          username: userUsername,
          userType,
          token,
        };
        setUser(userData);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiService.clearAuthToken();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
