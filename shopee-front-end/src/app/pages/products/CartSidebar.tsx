import React from 'react';
import styles from './CartModal.module.scss';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onClear: () => void;
  loading?: boolean;
}

export default function CartSidebar({ isOpen, onClose, cartItems, onRemove, onUpdateQuantity, onClear, loading }: CartSidebarProps) {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return (
    <div className={isOpen ? styles.sidebarOpen : styles.sidebarClosed}>
      <div className={styles.sidebarHeader}>
        <h2>Giỏ hàng</h2>
        <button onClick={onClose} className={styles.closeButton}>×</button>
      </div>
      <div className={styles.sidebarContent}>
        {cartItems.length === 0 ? (
          <p>Chưa có sản phẩm nào trong giỏ.</p>
        ) : (
          <>
            {cartItems.map(item => (
              <div key={item.productId || item.id} className={styles.cartItem}>
                {item.imageUrls && item.imageUrls.length > 0 ? (
                  <img src={item.imageUrls[0]} alt={item.productName || item.name} className={styles.cartItemImage} />
                ) : (
                  <div className={styles.cartItemImage} style={{background:'#eee',display:'flex',alignItems:'center',justifyContent:'center',color:'#bbb'}}>No Image</div>
                )}
                <div className={styles.cartItemInfo}>
                  <div>{item.productName || item.name}</div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <button onClick={() => onUpdateQuantity(item.productId || item.id, item.quantity - 1)} disabled={item.quantity <= 1 || loading} className={styles.qtyBtn}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.productId || item.id, item.quantity + 1)} disabled={loading} className={styles.qtyBtn}>+</button>
                  </div>
                  <div>Giá: {item.price?.toLocaleString?.() || item.price}₫</div>
                  <button onClick={() => onRemove(item.productId || item.id)} className={styles.removeButton} disabled={loading}>Xóa</button>
                </div>
              </div>
            ))}
            <div className={styles.cartSummary}>
              <div>Tổng cộng: <b>{total.toLocaleString()}₫</b></div>
              <div>Số sản phẩm: <b>{cartItems.reduce((s, i) => s + i.quantity, 0)}</b></div>
            </div>
            <div style={{display:'flex',gap:8,marginTop:16}}>
              <button onClick={onClear} className={styles.clearButton} disabled={loading}>Xóa tất cả</button>
              <button className={styles.checkoutButton} disabled={cartItems.length === 0 || loading}>Thanh toán</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
