import { useState, useEffect } from 'react';
import { fetchCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, clearCart as apiClearCart, updateCartItemQuantity as apiUpdateCartItemQuantity } from '@/app/services/cartApi';
import { useAuth } from '@/app/contexts/AuthContext';

export function useCart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load cart from backend when user changes
  useEffect(() => {
    const load = async () => {
      if (!user || !user.token) {
        setCartItems([]);
        return;
      }
      setLoading(true);
      try {
        const cart = await fetchCart(user.token);
        setCartItems(cart.items || []);
      } catch {
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const addToCart = async (product: any) => {
    if (!user || !user.token) return;
    setLoading(true);
    try {
      const cart = await apiAddToCart(user.token, product, 1);
      setCartItems(cart.items || []);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user || !user.token) return;
    setLoading(true);
    try {
      const cart = await apiRemoveFromCart(user.token, productId);
      setCartItems(cart.items || []);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user || !user.token) return;
    setLoading(true);
    try {
      await apiClearCart(user.token);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user || !user.token) return;
    if (quantity < 1) return;
    setLoading(true);
    try {
      const cart = await apiUpdateCartItemQuantity(user.token, productId, quantity);
      setCartItems(cart.items || []);
    } finally {
      setLoading(false);
    }
  };

  return { cartItems, addToCart, removeFromCart, clearCart, updateQuantity, loading };
}
