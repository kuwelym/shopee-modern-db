import React from "react";
import type { Product } from "../types/product";

interface CartSidebarProps {
  cart: { product: Product; quantity: number }[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  formatPrice: (price: number) => string;
  cartLoading: boolean;
  onClose: () => void;
  onBuy: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  cart,
  selected,
  setSelected,
  formatPrice,
  cartLoading,
  onClose,
  onBuy,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <>
      {/* Overlay mờ */}
      <div onClick={onClose} style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.18)',zIndex:2999}} />
      <div style={{
        position: 'fixed',
        top: 80,
        right: 0,
        height: 'calc(100vh - 80px)',
        width: 390,
        background: '#fff',
        boxShadow: '-8px 0 32px #ff980055',
        zIndex: 3000,
        borderTopLeftRadius: 24,
        borderBottomLeftRadius: 24,
        animation: 'slideInCart .3s cubic-bezier(.4,1.2,.6,1)',
        maxWidth: '100vw',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        overflow: 'hidden',
      }}>
        {/* Header giỏ hàng */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 18px 8px 18px',background:'#fffbe7',borderTopLeftRadius:24,boxShadow:'0 2px 12px #ff980022',position:'sticky',top:0,zIndex:2}}>
          <h2 style={{color:'#ff5722',fontWeight:900,fontSize:17,margin:0,letterSpacing:0.5}}>🛒 Giỏ hàng</h2>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:22,color:'#ff5722',cursor:'pointer',marginLeft:8}} title="Đóng">×</button>
        </div>
        {/* Danh sách sản phẩm trong giỏ */}
        <div style={{flex:1,overflowY:'auto',padding:'8px 24px 8px 24px',background:'#fff'}}>
          {cart.length === 0 ? (
            <div style={{color:'#888',fontWeight:600,fontSize:17,marginTop:40}}>Chưa có sản phẩm nào trong giỏ.</div>
          ) : (
            cart.map((item, idx) => (
              <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #ffe0b2', padding: '10px 0', position:'relative' }}>
                <input
                  type="checkbox"
                  checked={selected.includes(String(item.product.id))}
                  onChange={e => {
                    setSelected(sel => e.target.checked ? [...sel, String(item.product.id)] : sel.filter(id => id !== String(item.product.id)));
                  }}
                  style={{ width: 20, height: 20, accentColor: '#ff9800', marginRight: 2, cursor: 'pointer' }}
                  title="Chọn sản phẩm để mua"
                />
                <img src={item.product.imageUrls?.[0] || '/file.svg'} alt={item.product.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', background: '#fff', border: '1px solid #ffe0b2' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#ff5722', fontSize: 15, marginBottom: 2 }}>{item.product.name}</div>
                  <div style={{ color: '#ff9800', fontWeight: 700, fontSize: 14 }}>{formatPrice(item.product.price)}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, minWidth: 40, width: 40 }}>
                  <button
                    onClick={() => onUpdateQuantity(String(item.product.id), item.quantity + 1)}
                    style={{
                      background: '#fff',
                      color: '#ff9800',
                      border: '2px solid #ff9800',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      fontWeight: 900,
                      fontSize: 22,
                      cursor: 'pointer',
                      lineHeight: 1,
                      boxShadow: '0 1px 4px #ff980022',
                      transition: 'background .2s,color .2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: 0
                    }}
                    title="Tăng số lượng"
                    disabled={cartLoading}
                  >
                    <span style={{color:'#ff9800',fontWeight:900, fontSize: 22, lineHeight: 1}}>+</span>
                  </button>
                  <span style={{ fontWeight: 700, fontSize: 17, minWidth: 24, textAlign: 'center', display: 'inline-block', lineHeight: '32px', height: 32 }}>{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(String(item.product.id), item.quantity - 1)}
                    style={{
                      background: '#fff',
                      color: '#ff9800',
                      border: '2px solid #ff9800',
                      borderRadius: '50%',
                      width: 32,
                      height: 32,
                      fontWeight: 900,
                      fontSize: 22,
                      cursor: item.quantity === 1 ? 'not-allowed' : 'pointer',
                      lineHeight: 1,
                      opacity: item.quantity === 1 ? 0.5 : 1,
                      boxShadow: '0 1px 4px #ff980022',
                      transition: 'background .2s,color .2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: 0
                    }}
                    disabled={item.quantity === 1 || cartLoading}
                    title="Giảm số lượng"
                  >
                    <span style={{color:'#ff9800',fontWeight:900, fontSize: 22, lineHeight: 1}}>-</span>
                  </button>
                </div>
                <button
                  onClick={() => onRemove(String(item.product.id))}
                  style={{
                    background: '#fff',
                    border: '2px solid #ff5722',
                    color: '#ff5722',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    fontSize: 22,
                    cursor: 'pointer',
                    marginLeft: 8,
                    boxShadow: '0 1px 4px #ff572222',
                    transition: 'background .2s,color .2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Xóa khỏi giỏ"
                  disabled={cartLoading}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
        {/* Tổng tiền + nút mua hàng */}
        <div style={{padding:'18px 28px 22px 28px',background:'#fffbe7',borderBottomLeftRadius:24,boxShadow:'0 -2px 12px #ff980022',position:'sticky',bottom:0,zIndex:2}}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 800, fontSize: 18, margin: '0 0 12px 0' }}>
            <span>Tổng cộng:</span>
            <span style={{ color: '#ff5722', fontSize: 22 }}>
              {formatPrice(cart.filter(item => selected.includes(String(item.product.id))).reduce((sum, item) => sum + item.product.price * item.quantity, 0))}
            </span>
          </div>
          <button
            style={{
              width: '100%',
              background: selected.length === 0 ? '#eee' : 'linear-gradient(90deg,#ff9800 0%,#ff5722 100%)',
              color: selected.length === 0 ? '#bbb' : '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '16px 0',
              fontWeight: 900,
              fontSize: 19,
              cursor: selected.length === 0 ? 'not-allowed' : 'pointer',
              fontFamily: 'Garamond, serif',
              boxShadow: '0 2px 8px #ff980033',
              letterSpacing: 1,
              transition: 'background .2s, color .2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
            onClick={onBuy}
            disabled={selected.length === 0}
            title={selected.length === 0 ? 'Chọn sản phẩm để mua' : 'Mua các sản phẩm đã chọn'}
          >
            <span role="img" aria-label="cart">🛒</span> Mua hàng
          </button>
        </div>
      </div>
      {/* Hiệu ứng slideInCart */}
      <style>{`
        @keyframes slideInCart {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default CartSidebar;