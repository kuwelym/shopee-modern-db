'use client';

import { useState } from 'react';
import { useProducts } from './hooks';
import { useCart } from './hooks/useCart';
import CartSidebar from './CartSidebar';
import Toast from './Toast';
import styles from './style.module.scss';

export default function ProductsPage() {
  const {
    products,
    loading,
    searchQuery,
    error,
    user,
    isLoading,
    setSearchQuery,
    handleSearch,
    clearSearch,
    loadProducts,
    formatPrice,
    navigateBack,
  } = useProducts();
  const { cartItems, addToCart, removeFromCart, clearCart, updateQuantity, loading: cartLoading } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);
  const [filter, setFilter] = useState({ inStock: false, minPrice: '', maxPrice: '' });

  // Lọc sản phẩm theo filter
  const filteredProducts = products.filter(product => {
    if (filter.inStock && product.stock === 0) return false;
    if (filter.minPrice && product.price < Number(filter.minPrice)) return false;
    if (filter.maxPrice && product.price > Number(filter.maxPrice)) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user || user.userType !== 'BUYER') {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Sản phẩm nổi bật</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setCartOpen(true)} className={styles.viewButton}>
            🛒 Xem giỏ hàng ({cartItems.length})
          </button>
          <button onClick={navigateBack} className={styles.backButton}>
            ← Quay lại trang chính
          </button>
        </div>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className={styles.searchButton}>
            Tìm kiếm
          </button>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: 8 }}>
          <label>
            <input
              type="checkbox"
              checked={filter.inStock}
              onChange={e => setFilter(f => ({ ...f, inStock: e.target.checked }))}
            />
            Còn hàng
          </label>
          <input
            type="number"
            placeholder="Giá từ"
            value={filter.minPrice}
            onChange={e => setFilter(f => ({ ...f, minPrice: e.target.value }))}
            style={{ width: 80 }}
          />
          <input
            type="number"
            placeholder="Đến"
            value={filter.maxPrice}
            onChange={e => setFilter(f => ({ ...f, maxPrice: e.target.value }))}
            style={{ width: 80 }}
          />
          {searchQuery && (
            <button onClick={clearSearch} className={styles.clearButton}>
              Xóa tìm kiếm
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={loadProducts} className={styles.retryButton}>
            Thử lại
          </button>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Đang tải sản phẩm...</div>
      ) : (
        <div className={styles.productsGrid}>
          {filteredProducts.length === 0 ? (
            <div className={styles.noProducts}>
              <p>Không tìm thấy sản phẩm phù hợp.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div style={{ width: '100%', height: 180, marginBottom: 12, background: '#f8f8f8', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {product.imageUrls && product.imageUrls.length > 0 ? (
                    <img src={product.imageUrls[0]} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                  ) : (
                    <span style={{ color: '#bbb' }}>Không có ảnh</span>
                  )}
                </div>
                <div className={styles.productHeader}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <span className={styles.productPrice}>{formatPrice(product.price)}</span>
                </div>
                <p className={styles.productDescription}>{product.description}</p>
                <div className={styles.productInfo}>
                  <span className={styles.stock}>
                    Số lượng: {product.stock}
                    {product.stock === 0 && (
                      <span className={styles.outOfStock}> (Hết hàng)</span>
                    )}
                  </span>
                  {product.imageUrls.length > 0 && (
                    <div className={styles.images}>
                      <span className={styles.imageCount}>
                        📷 {product.imageUrls.length} ảnh
                      </span>
                    </div>
                  )}
                </div>
                <div className={styles.productActions}>
                  <button
                    className={styles.viewButton}
                    disabled={product.stock === 0}
                    onClick={() => {
                      addToCart(product);
                      setToast({ message: 'Đã thêm vào giỏ hàng!', type: 'success' });
                    }}
                  >
                    {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onClear={clearCart}
        loading={cartLoading}
      />
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
