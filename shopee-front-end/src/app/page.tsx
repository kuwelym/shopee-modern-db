
"use client";

import React, { useState } from "react";
import { useProducts } from "./pages/products/hooks";
import { useCart } from "./pages/products/hooks/useCart";
import CartSidebar from "./components/CartSidebar";
import * as orderApi from "./services/orderApi";
import Toast from "./pages/products/Toast";
import styles from "./pages/products/style.module.scss";

export default function Home() {

  const {
    products,
    loading,
    searchQuery,
    error,
    isLoading,
    setSearchQuery,
    handleSearch,
    clearSearch,
    loadProducts,
    formatPrice,
  } = useProducts();
  const { cartItems, addToCart, removeFromCart, clearCart, updateQuantity, loading: cartLoading } = useCart();
  const [selected, setSelected] = useState<string[]>([]); // id các sản phẩm được chọn để mua
  // Hàm xử lý mua hàng
  const handleBuyCart = async () => {
    if (!user || !user.token) {
      setToast({ message: "Bạn cần đăng nhập để mua hàng", type: "error" });
      return;
    }
    const items = cartItems
      .filter((item: any) => selected.includes(String(item.product.id)))
      .map((item: any) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        name: item.product.name,
      }));
    if (items.length === 0) {
      setToast({ message: "Vui lòng chọn sản phẩm để mua", type: "error" });
      return;
    }
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    try {
      await orderApi.createOrder(user.token, { items, total });
      setToast({ message: "Đặt hàng thành công!", type: "success" });
      clearCart();
      setSelected([]);
      setCartOpen(false);
    } catch (e: any) {
      setToast({ message: e?.message || "Đặt hàng thất bại", type: "error" });
    }
  };
  const [cartOpen, setCartOpen] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);
  const [filter, setFilter] = useState({ inStock: false, minPrice: "", maxPrice: "" });

  // Lọc sản phẩm theo filter
  const filteredProducts = products.filter((product) => {
    if (filter.inStock && product.stock === 0) return false;
    if (filter.minPrice && product.price < Number(filter.minPrice)) return false;
    if (filter.maxPrice && product.price > Number(filter.maxPrice)) return false;
    return true;
  });

  // Kiểm tra user đăng nhập, nếu chưa thì chuyển hướng sang trang guest
  const [user, setUser] = useState<any>(null);
  const { useRouter } = require('next/navigation');
  const router = useRouter();
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      setUser(u);
      if (!u) {
        router.replace('/guest');
      }
    }
  }, [router]);

  return (
    <div className={styles.container} style={{ background: '#fff' }}>
      <header style={{ background: '#ff5722', color: '#fff', padding: '1.5rem 0 1rem 0', marginBottom: 24, boxShadow: '0 2px 8px #0001' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: 1, color: '#fff', margin: 0 }}>Shopee</h1>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setCartOpen(true)} style={{ background: '#fff', color: '#ff5722', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0002' }}>
              🛒 Giỏ hàng ({cartItems.length})
            </button>
            {user && (
              <>
                <button onClick={() => setShowOrders((v) => !v)} style={{ background: '#fff', color: '#ff5722', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0002' }}>
                  Đơn đã mua
                </button>
                <button onClick={() => setShowAccount((v) => !v)} style={{ background: '#fff', color: '#ff5722', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0002' }}>
                  Tài khoản
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <div className={styles.header} style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className={styles.searchSection} style={{ marginBottom: 24 }}>
          <div className={styles.searchBox} style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              style={{ flex: 1, borderRadius: 6, border: '1px solid #eee', padding: 10, fontSize: 16 }}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch} className={styles.searchButton} style={{ background: '#ff5722', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
              Tìm kiếm
            </button>
            {searchQuery && (
              <button onClick={clearSearch} className={styles.clearButton} style={{ background: '#eee', color: '#ff5722', border: 'none', borderRadius: 6, padding: '10px 14px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
                Xóa
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <label style={{ fontWeight: 500 }}>
              <input
                type="checkbox"
                checked={filter.inStock}
                onChange={e => setFilter(f => ({ ...f, inStock: e.target.checked }))}
                style={{ marginRight: 4 }}
              />
              Còn hàng
            </label>
            <input
              type="number"
              placeholder="Giá từ"
              value={filter.minPrice}
              onChange={e => setFilter(f => ({ ...f, minPrice: e.target.value }))}
              style={{ width: 90, borderRadius: 6, border: '1px solid #eee', padding: 6 }}
            />
            <input
              type="number"
              placeholder="Đến"
              value={filter.maxPrice}
              onChange={e => setFilter(f => ({ ...f, maxPrice: e.target.value }))}
              style={{ width: 90, borderRadius: 6, border: '1px solid #eee', padding: 6 }}
            />
          </div>
        </div>
        <h2 className={styles.title} style={{ fontSize: 28, fontWeight: 800, color: '#ff5722', margin: '0 0 18px 0' }}>Sản phẩm nổi bật</h2>
      </div>

      {showOrders && user && (
        <div style={{ maxWidth: 800, margin: '0 auto 24px auto', background: '#fffbe7', borderRadius: 10, boxShadow: '0 2px 8px #0001', padding: 24 }}>
          <h3 style={{ color: '#ff5722', fontWeight: 800, fontSize: 22, marginBottom: 12 }}>Đơn hàng đã mua</h3>
          <p>Chức năng xem đơn hàng đã mua sẽ hiển thị ở đây.</p>
        </div>
      )}
      {showAccount && user && (
        <div style={{ maxWidth: 600, margin: '0 auto 24px auto', background: '#e3f2fd', borderRadius: 10, boxShadow: '0 2px 8px #0001', padding: 24 }}>
          <h3 style={{ color: '#1976d2', fontWeight: 800, fontSize: 22, marginBottom: 12 }}>Thông tin tài khoản</h3>
          <div><b>Email:</b> {user.email}</div>
          <div><b>Loại tài khoản:</b> {user.userType}</div>
        </div>
      )}

      {error && (
        <div className={styles.error} style={{ color: '#ff5722', fontWeight: 700, marginBottom: 16 }}>
          <p>{error}</p>
          <button onClick={loadProducts} className={styles.retryButton} style={{ background: '#ff5722', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
            Thử lại
          </button>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Đang tải sản phẩm...</div>
      ) : (
        <div className={styles.productsGrid} style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 24 }}>
          {filteredProducts.length === 0 ? (
            <div className={styles.noProducts} style={{ gridColumn: '1/-1', textAlign: 'center', color: '#bbb', fontWeight: 600 }}>
              <p>Không tìm thấy sản phẩm phù hợp.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className={styles.productCard} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'stretch', transition: 'box-shadow .2s', border: '1px solid #f5f5f5' }}>
                <div style={{ width: '100%', height: 180, marginBottom: 12, background: '#f8f8f8', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {product.imageUrls && product.imageUrls.length > 0 ? (
                    <img src={product.imageUrls[0]} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                  ) : (
                    <span style={{ color: '#bbb' }}>Không có ảnh</span>
                  )}
                </div>
                <div className={styles.productHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <h3 className={styles.productName} style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{product.name}</h3>
                  <span className={styles.productPrice} style={{ color: '#ff5722', fontWeight: 800, fontSize: 18 }}>{formatPrice(product.price)}</span>
                </div>
                <p className={styles.productDescription} style={{ color: '#666', fontSize: 14, margin: '4px 0 10px 0', minHeight: 36 }}>{product.description}</p>
                <div className={styles.productInfo} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#888', marginBottom: 8 }}>
                  <span className={styles.stock}>
                    Số lượng: {product.stock}
                    {product.stock === 0 && (
                      <span className={styles.outOfStock} style={{ color: '#ff5722', fontWeight: 700 }}> (Hết hàng)</span>
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
                <div className={styles.productActions} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    className={styles.viewButton}
                    style={{ background: product.stock === 0 ? '#eee' : '#ff5722', color: product.stock === 0 ? '#aaa' : '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: product.stock === 0 ? 'not-allowed' : 'pointer', transition: 'background .2s' }}
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
        cart={cartItems.map((item: any) => ({ product: item.product, quantity: item.quantity }))}
        selected={selected}
        setSelected={setSelected}
        formatPrice={formatPrice}
        cartLoading={cartLoading}
        onClose={() => setCartOpen(false)}
        onBuy={handleBuyCart}
        onUpdateQuantity={(productId, quantity) => updateQuantity(productId, quantity)}
        onRemove={removeFromCart}
      />
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
