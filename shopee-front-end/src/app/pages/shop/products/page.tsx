'use client';

import { useShopProducts } from './hooks';
import { Product } from '@/app/types/product';
import styles from './style.module.scss';

export default function ShopProductsPage() {
  const {
    products,
    loading,
    error,
    showCreateForm,
    editingProduct,
    user,
    isLoading,
    form,
    handleImageUrlsChange,
    onSubmit,
    handleEdit,
    handleDelete,
    resetForm,
    formatPrice,
    navigateBack,
    clearError,
    openCreateForm,
  } = useShopProducts();

  const { register, watch } = form;
  const formData = watch();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user || user.userType !== 'SHOP') {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Products</h1>
        <div className={styles.headerActions}>
          <button 
            onClick={openCreateForm}
            className={styles.addButton}
            disabled={loading}
          >
            + Add Product
          </button>
          <button 
            onClick={navigateBack}
            className={styles.backButton}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={clearError} className={styles.closeButton}>
            ×
          </button>
        </div>
      )}

      {showCreateForm && (
        <div className={styles.formOverlay}>
          <div className={styles.formContainer}>
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={onSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  {...register('name', { required: 'Product name is required' })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  {...register('description', { required: 'Description is required' })}
                  rows={4}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="price">Price ($) *</label>
                  <input
                    type="number"
                    id="price"
                    {...register('price', { 
                      required: 'Price is required',
                      min: { value: 0.01, message: 'Price must be greater than 0' }
                    })}
                    min="0"
                    step="0.01"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="stock">Stock *</label>
                  <input
                    type="number"
                    id="stock"
                    {...register('stock', { 
                      required: 'Stock is required',
                      min: { value: 0, message: 'Stock cannot be negative' }
                    })}
                    min="0"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="categoryId">Category ID (optional)</label>
                <input
                  type="text"
                  id="categoryId"
                  {...register('categoryId')}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="imageUrls">Image URLs (one per line)</label>
                <textarea
                  id="imageUrls"
                  value={formData.imageUrlsText || ''}
                  onChange={handleImageUrlsChange}
                  rows={3}
                  className={styles.textarea}
                  placeholder="https://example.com/image1.jpg"
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={resetForm}
                  className={styles.cancelButton}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && !showCreateForm ? (
        <div className={styles.loading}>Loading products...</div>
      ) : (
        <div className={styles.productsGrid}>
          {products.length === 0 ? (
            <div className={styles.noProducts}>
              <p>No products found. Add your first product!</p>
            </div>
          ) : (
            products.map((product: Product) => (
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
                  {product.categoryId && (
                    <span className={styles.category}>
                      Category: {product.categoryId}
                    </span>
                  )}
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
                    onClick={() => handleEdit(product)}
                    className={styles.editButton}
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id!)}
                    className={styles.deleteButton}
                    disabled={loading}
                  >
                    Delete
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
