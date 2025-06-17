'use client';

import { useProducts } from './hooks';
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
        <h1 className={styles.title}>Products</h1>
        <button 
          onClick={navigateBack}
          className={styles.backButton}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className={styles.searchButton}>
            Search
          </button>
        </div>
        {searchQuery && (
          <button onClick={clearSearch} className={styles.clearButton}>
            Clear Search
          </button>
        )}
      </div>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={loadProducts} className={styles.retryButton}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Loading products...</div>
      ) : (
        <div className={styles.productsGrid}>
          {products.length === 0 ? (
            <div className={styles.noProducts}>
              <p>No products found.</p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productHeader}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <span className={styles.productPrice}>
                    {formatPrice(product.price)}
                  </span>
                </div>
                <p className={styles.productDescription}>{product.description}</p>
                <div className={styles.productInfo}>
                  <span className={styles.stock}>
                    Stock: {product.stock}
                    {product.stock === 0 && (
                      <span className={styles.outOfStock}> (Out of Stock)</span>
                    )}
                  </span>
                  {product.imageUrls.length > 0 && (
                    <div className={styles.images}>
                      <span className={styles.imageCount}>
                        📷 {product.imageUrls.length} image(s)
                      </span>
                    </div>
                  )}
                </div>
                <div className={styles.productActions}>
                  <button 
                    className={styles.viewButton}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 
