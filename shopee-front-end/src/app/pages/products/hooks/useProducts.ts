import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { apiService } from '@/app/services/api';
import { Product } from '@/app/types/product';

export function useProducts() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/pages/auth/login');
      return;
    }

    if (user && user.userType === 'SHOP') {
      router.push('/pages/shop/products');
      return;
    }

    if (user) {
      loadProducts();
    }
  }, [user, isLoading, router]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAllProducts();
      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        setError(response.message || 'Failed to load products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      loadProducts();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.searchProducts(searchQuery.trim());
      if (response.success && response.data) {
        setProducts(response.data);
      } else {
        setError(response.message || 'Search failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, loadProducts]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    loadProducts();
  }, [loadProducts]);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }, []);

  const navigateBack = useCallback(() => {
    router.push('/pages/welcome');
  }, [router]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    products,
    loading,
    searchQuery,
    error,
    user,
    isLoading,
    
    // Actions
    setSearchQuery,
    handleSearch,
    clearSearch,
    loadProducts,
    formatPrice,
    navigateBack,
    clearError,
  };
} 
