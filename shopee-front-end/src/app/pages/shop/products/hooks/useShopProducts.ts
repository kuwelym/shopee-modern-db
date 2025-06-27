import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/app/contexts/AuthContext';
import { apiService } from '@/app/services/api';
import { Product, CreateProductRequest, UpdateProductRequest } from '@/app/types/product';

interface ProductForm extends CreateProductRequest {
  imageUrlsText: string; // For handling textarea input
}

export function useShopProducts() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const form = useForm<ProductForm>({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: '',
      imageUrls: [],
      imageUrlsText: '',
    },
    mode: 'onChange'
  });

  const { handleSubmit, formState: { isSubmitting }, reset, setValue } = form;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/pages/auth/login');
      return;
    }

    if (user && user.userType === 'BUYER') {
      router.push('/pages/products');
      return;
    }

    if (user) {
      // Set shopId from user data
      loadProducts();
    }
  }, [user, isLoading, router]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getMyProducts();
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

  const handleImageUrlsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const urls = value.split('\n').map(url => url.trim()).filter(url => url);
    setValue('imageUrlsText', value);
    setValue('imageUrls', urls);
  }, [setValue]);

  const onSubmit = useCallback(async (data: ProductForm) => {
    // Validate required fields
    if (!data.name || !data.description || data.price <= 0 || data.stock < 0) {
      setError('Please fill in all required fields with valid values');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (editingProduct) {
        // Update existing product
        const updateData: UpdateProductRequest = {
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          categoryId: data.categoryId || undefined,
          imageUrls: data.imageUrls,
        };
        const response = await apiService.updateProduct(editingProduct.id!, updateData);
        if (response.success) {
          setEditingProduct(null);
          resetForm();
          loadProducts();
        } else {
          setError(response.message || 'Failed to update product');
        }
      } else {
        const createData: CreateProductRequest = {
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          categoryId: data.categoryId || '',
          imageUrls: data.imageUrls,
        };
        const response = await apiService.createProduct(createData);
        if (response.success) {
          setShowCreateForm(false);
          resetForm();
          loadProducts();
        } else {
          setError(response.message || 'Failed to create product');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setLoading(false);
    }
  }, [editingProduct, loadProducts]);

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId || '',
      imageUrls: product.imageUrls,
      imageUrlsText: product.imageUrls.join('\n'),
    });
    setShowCreateForm(true);
  }, [reset]);

  const handleDelete = useCallback(async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.deleteProduct(productId);
      if (response.success) {
        loadProducts();
      } else {
        setError(response.message || 'Failed to delete product');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  }, [loadProducts]);

  const resetForm = useCallback(() => {
    reset({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: '',
      imageUrls: [],
      imageUrlsText: '',
    });
    setShowCreateForm(false);
    setEditingProduct(null);
  }, [reset]);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }, []);

  // Đã xoá navigateBack vì không còn trang welcome

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const openCreateForm = useCallback(() => {
    setShowCreateForm(true);
  }, []);

  return {
    // State
    products,
    loading: loading || isSubmitting,
    error,
    showCreateForm,
    editingProduct,
    user,
    isLoading,
    
    // Form
    form,
    
    // Actions
    loadProducts,
    handleImageUrlsChange,
    onSubmit: handleSubmit(onSubmit),
    handleEdit,
    handleDelete,
    resetForm,
    formatPrice,
    clearError,
    openCreateForm,
    setShowCreateForm,
  };
} 
