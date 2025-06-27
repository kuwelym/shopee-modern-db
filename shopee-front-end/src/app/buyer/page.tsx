"use client";

import React, { type ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import BaseLayout from "../components/BaseLayout";
import { useProducts } from "../pages/products/hooks/useProducts";
import type { Product } from "../types/product";
import { useAuth } from "../contexts/AuthContext";
import * as cartApi from '../services/cartApi';
import * as orderApi from '../services/orderApi';
import CartSidebar from "../components/CartSidebar";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export default function BuyerHomePage() {
  const { products, loading, searchQuery, setSearchQuery, handleSearch, clearSearch, formatPrice } = useProducts();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [cart, setCart] = React.useState<{product: Product, quantity: number}[]>([]); // Giỏ hàng: product + quantity
  const [cartLoading, setCartLoading] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]); // id các sản phẩm (string)
  const [toast, setToast] = React.useState<string | null>(null);
  // Toast tự động tắt sau 2s
  React.useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(t);
    }
  }, [toast]);
  const [showCart, setShowCart] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);
  const [showOrders, setShowOrders] = React.useState(false);
  const [showSupport, setShowSupport] = React.useState(false);
  const [showChat, setShowChat] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);
  const [showReview, setShowReview] = React.useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Thêm khai báo đúng type cho history
  const [history, setHistory] = React.useState<Product[]>([]);

  // Lọc sản phẩm
  const filteredProducts = products;

  // Lấy cart từ backend khi mở giỏ hàng hoặc khi user đổi
  React.useEffect(() => {
    if (user?.token) {
      setCartLoading(true);
      cartApi.fetchCart(user.token)
        .then(data => {
          setCart(
            Array.isArray(data.items)
              ? data.items
                  .filter((item: any) => item.productId && item.productName)
                  .map((item: any) => ({
                    product: {
                      id: item.productId,
                      name: item.productName,
                      price: item.price,
                      imageUrls: item.imageUrls || [],
                      description: item.description || '',
                      stock: item.stock || 0,
                      shopId: item.shopId || '',
                      createdAt: '', updatedAt: '', isActive: true
                    },
                    quantity: item.quantity
                  }))
              : []
          );
        })
        .catch(() => setCart([]))
        .finally(() => setCartLoading(false));
    } else {
      setCart([]);
    }
  }, [user?.token]);

  // Thêm vào giỏ hàng: gọi API
  const addToCart = async (product: Product) => {
    if (!user?.token || !product?.id) return;
    setCartLoading(true);
    try {
      await cartApi.addToCart(user.token, product, 1);
      setToast('Thêm vào giỏ hàng thành công!');
      // Refresh cart
      const data = await cartApi.fetchCart(user.token);
      setCart(Array.isArray(data.items) ? data.items.map((item: any) => ({
        product: {
          id: item.productId,
          name: item.productName,
          price: item.price,
          imageUrls: item.imageUrls || [],
          description: item.description || '',
          stock: item.stock || 0,
          shopId: item.shopId || '',
          createdAt: '', updatedAt: '', isActive: true
        },
        quantity: item.quantity
      })) : []);
    } catch {
      setToast('Lỗi khi thêm vào giỏ hàng!');
    } finally {
      setCartLoading(false);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (productId: string) => {
    if (!user?.token) return;
    setCartLoading(true);
    try {
      await cartApi.removeFromCart(user.token, productId);
      const data = await cartApi.fetchCart(user.token);
      setCart(Array.isArray(data.items) ? data.items.map((item: any) => ({
        product: {
          id: item.productId,
          name: item.productName,
          price: item.price,
          imageUrls: item.imageUrls || [],
          description: item.description || '',
          stock: item.stock || 0,
          shopId: item.shopId || '',
          createdAt: '', updatedAt: '', isActive: true
        },
        quantity: item.quantity
      })) : []);
    } finally {
      setCartLoading(false);
    }
  };

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateCartItemQuantity = async (productId: string, quantity: number) => {
    if (!user?.token) return;
    setCartLoading(true);
    try {
      await cartApi.updateCartItemQuantity(user.token, productId, quantity);
      const data = await cartApi.fetchCart(user.token);
      setCart(Array.isArray(data.items) ? data.items.map((item: any) => ({
        product: {
          id: item.productId,
          name: item.productName,
          price: item.price,
          imageUrls: item.imageUrls || [],
          description: item.description || '',
          stock: item.stock || 0,
          shopId: item.shopId || '',
          createdAt: '', updatedAt: '', isActive: true
        },
        quantity: item.quantity
      })) : []);
    } finally {
      setCartLoading(false);
    }
  };

  // Xóa toàn bộ giỏ hàng (clearCart)
  const clearCart = async () => {
    if (!user?.token) return;
    setCartLoading(true);
    try {
      await cartApi.clearCart(user.token);
      setCart([]);
      setSelected([]);
    } finally {
      setCartLoading(false);
    }
  };

  // Mua hàng từ giỏ: clear các sản phẩm đã chọn trên backend
  const buyFromCart = async () => {
    if (!user?.token || selected.length === 0) return;
    setCartLoading(true);
    try {
      // Chuẩn bị dữ liệu đơn hàng
      const items = cart.filter(item => selected.includes(String(item.product.id))).map(item => ({
        productId: String(item.product.id),
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrls?.[0] || ''
      }));
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const order = {
        items,
        total
      };
      await orderApi.createOrder(user.token, order);
      setToast('Đặt hàng thành công!');
      // Xóa các sản phẩm đã mua khỏi cart
      await Promise.all(selected.map(pid => cartApi.removeFromCart(user.token!, pid)));
      // Refresh cart
      const data = await cartApi.fetchCart(user.token);
      setCart(Array.isArray(data.items) ? data.items.map((item: any) => ({
        product: {
          id: item.productId,
          name: item.productName,
          price: item.price,
          imageUrls: item.imageUrls || [],
          description: item.description || '',
          stock: item.stock || 0,
          shopId: item.shopId || '',
          createdAt: '', updatedAt: '', isActive: true
        },
        quantity: item.quantity
      })) : []);
      setSelected([]);
      setShowCart(false);
    } catch {
      setToast('Lỗi khi đặt hàng!');
    } finally {
      setCartLoading(false);
    }
  };

  // Mua nhanh 1 sản phẩm (có thể tích hợp API đặt hàng thực tế nếu có)
  const buyNow = async (product: Product) => {
    if (!user?.token || !product?.id) return;
    setCartLoading(true);
    try {
      // Nếu sản phẩm đã có trong cart thì xóa khỏi cart (giả lập mua luôn)
      await cartApi.removeFromCart(user.token, String(product.id));
      setHistory((prev) => [...prev, product]);
      setToast(`Đã mua sản phẩm: ${product.name}`);
      // Refresh cart
      const data = await cartApi.fetchCart(user.token);
      setCart(Array.isArray(data.items) ? data.items.map((item: any) => ({
        product: {
          id: item.productId,
          name: item.productName,
          price: item.price,
          imageUrls: item.imageUrls || [],
          description: item.description || '',
          stock: item.stock || 0,
          shopId: item.shopId || '',
          createdAt: '', updatedAt: '', isActive: true
        },
        quantity: item.quantity
      })) : []);
    } catch {
      setToast('Lỗi khi mua sản phẩm!');
    } finally {
      setCartLoading(false);
    }
  };

  // Modal đơn giản
  function Modal({ title, onClose, children }: ModalProps) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 340, maxWidth: 480, fontFamily: 'Garamond, serif', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#ff5722', cursor: 'pointer' }}>×</button>
          <h3 style={{ marginTop: 0, color: '#ff5722', fontWeight: 900 }}>{title}</h3>
          {children}
        </div>
      </div>
    );
  }
  return (
    <BaseLayout
      role="buyer"
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onSearch={handleSearch}
      onClearSearch={clearSearch}
      showSearch={false}
    >
      {/* Thanh tìm kiếm nằm ngay dưới header */}
      <div style={{ maxWidth: 900, margin: '0 auto', marginTop: 32, marginBottom: 32, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #ff980033', padding: 24, display: 'flex', alignItems: 'stretch', gap: 12, position: 'relative', zIndex: 2, fontFamily: 'Garamond, serif' }}>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm, thương hiệu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, borderRadius: 8, border: '2px solid #ff9800', padding: '14px 18px', fontSize: 18, outline: 'none', fontWeight: 500, fontFamily: 'Garamond, serif', height: '100%', minHeight: 52, boxSizing: 'border-box' }}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={() => handleSearch()} style={{ background: 'linear-gradient(90deg, #ff9800 0%, #ff5722 100%)', color: '#fff', border: '2px solid #ff9800', borderRadius: 8, padding: '0 32px', fontWeight: 800, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px #ff980033', fontFamily: 'Garamond, serif', height: '100%', minHeight: 52, display: 'flex', alignItems: 'center' }}>
          Tìm kiếm
        </button>
        {searchQuery && (
          <button onClick={clearSearch} style={{ background: '#eee', color: '#ff9800', border: 'none', borderRadius: 8, padding: '0 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: 'Garamond, serif', height: '100%', minHeight: 52, display: 'flex', alignItems: 'center' }}>
            Xóa
          </button>
        )}
      </div>
      {/* Toast thông báo */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 3000,
          background: '#fff',
          color: '#ff5722',
          border: '2px solid #ff9800',
          borderRadius: 10,
          padding: '16px 32px',
          fontWeight: 800,
          fontSize: 17,
          boxShadow: '0 4px 24px #ff980044',
          fontFamily: 'Garamond, serif',
          transition: 'opacity .2s',
        }}>
          {toast}
        </div>
      )}
      {/* Nút hỗ trợ khách hàng ở góc dưới phải */}
      <button
        onClick={() => setShowSupport(true)}
        style={{position:'fixed',right:32,bottom:32,zIndex:2000,background:'#ff9800',color:'#fff',border:'none',borderRadius:'50%',width:56,height:56,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 2px 12px #ff980033',fontSize:28,cursor:'pointer',transition:'box-shadow .2s'}}
        title="Hỗ trợ khách hàng"
      >
        <span role="img" aria-label="phone">📞</span>
      </button>
      {/* Nút menu 3 gạch cố định bên trái */}
      <button
        onClick={() => setMenuOpen((open) => !open)}
        style={{position:'fixed',top:80,left:24,zIndex:2100,background:'#fff',border:'1px solid #ff9800',borderRadius:12,width:54,height:54,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 24px #ff980044',fontSize:30,cursor:'pointer',transition:'box-shadow .2s'}}
        title="Mở menu chức năng"
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="6" width="32" height="4" rx="2" fill="#ff9800"/>
          <rect y="14" width="32" height="4" rx="2" fill="#ff9800"/>
          <rect y="22" width="32" height="4" rx="2" fill="#ff9800"/>
        </svg>
      </button>
      {/* Overlay mờ khi mở menu */}
      {menuOpen && (
        <>
          <div onClick={() => setMenuOpen(false)} style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.25)',zIndex:2199,transition:'background .3s'}} />
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 270,
            maxHeight: 'calc(100vh - 60px)', // trừ header và margin
            height: 'auto',
            background: 'linear-gradient(120deg,#fffbe7 80%,#ffe0b2 100%)',
            boxShadow: '4px 0 32px #ff980055',
            zIndex: 2200,
            padding: '36px 18px 18px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            borderTopRightRadius: 24,
            borderBottomRightRadius: 24,
            animation: 'slideInMenu .3s cubic-bezier(.4,1.2,.6,1)',
            overflowY: 'auto',
            marginTop: 60 // đẩy menu xuống dưới header
          }}>
            <button style={{alignSelf:'flex-end',background:'none',border:'none',fontSize:32,color:'#ff5722',cursor:'pointer',marginBottom:12,transition:'color .2s'}} onClick={() => setMenuOpen(false)} title="Đóng menu" onMouseOver={e=>e.currentTarget.style.color='#ff9800'} onMouseOut={e=>e.currentTarget.style.color='#ff5722'}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M7 7L21 21M21 7L7 21" stroke="#ff5722" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </button>
            <button style={menuBtnStyle} onClick={() => { setShowProfile(true); setMenuOpen(false); }}><span style={iconStyle}>👤</span> Cập nhật thông tin</button>
            <button style={menuBtnStyle} onClick={() => { setShowCart(true); setMenuOpen(false); }}><span style={iconStyle}>🛒</span> Giỏ hàng ({cart.length})</button>
            <button style={menuBtnStyle} onClick={() => { setShowOrders(true); setMenuOpen(false); }}><span style={iconStyle}>📦</span> Theo dõi đơn hàng</button>
            <button style={menuBtnStyle} onClick={() => { setShowHistory(true); setMenuOpen(false); }}><span style={iconStyle}>🕑</span> Lịch sử mua hàng</button>
            <button style={menuBtnStyle} onClick={() => { setShowChat(true); setMenuOpen(false); }}><span style={iconStyle}>💬</span> Chat với shop</button>
            <button style={{...menuBtnStyle,background:'#fff3e0',color:'#ff5722',border:'1.5px solid #ff9800'}} onClick={() => { logout(); setMenuOpen(false); setCart([]); setSelected([]); router.push("/"); }}><span style={iconStyle}>🚪</span> Đăng xuất</button>
          </div>
          {/* Hiệu ứng slideInMenu */}
          <style>{`
            @keyframes slideInMenu {
              from { transform: translateX(-100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}</style>
        </>
      )}
      {/* Thông tin cá nhân */}
      {showProfile && (
        <Modal title="Cập nhật thông tin cá nhân" onClose={() => setShowProfile(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{textAlign:'center',marginBottom:8}}>
              <span style={{fontSize:48}} role="img" aria-label="avatar">👤</span>
            </div>
            <input defaultValue={user?.username || ''} style={inputStyle} placeholder="Tên đăng nhập" disabled />
            {/* Có thể thêm các trường khác nếu backend trả về */}
            <button style={{background:'#ff9800',color:'#fff',border:'1px solid #ff9800',borderRadius:6,padding:'8px 18px',fontWeight:700,fontSize:15,cursor:'pointer',marginLeft:4,fontFamily:'Garamond, serif'}}>
              Lưu thay đổi
            </button>
          </div>
        </Modal>
      )}
      {/* Giỏ hàng */}
      {/* Sidebar giỏ hàng bên phải */}
      {showCart && (
        <CartSidebar
          cart={cart}
          selected={selected}
          setSelected={setSelected}
          formatPrice={formatPrice}
          cartLoading={cartLoading}
          onClose={() => setShowCart(false)}
          onBuy={buyFromCart}
          onUpdateQuantity={updateCartItemQuantity}
          onRemove={removeFromCart}
        />
      )}
      {/* Theo dõi đơn hàng */}
      {showOrders && (
        <Modal title="Theo dõi đơn hàng" onClose={() => setShowOrders(false)}>
          <div>Bạn chưa có đơn hàng nào.</div>
        </Modal>
      )}
      {/* Lịch sử mua hàng */}
      {showHistory && (
        <Modal title="Lịch sử mua hàng" onClose={() => setShowHistory(false)}>
          <div>Bạn chưa có lịch sử mua hàng.</div>
        </Modal>
      )}
      {/* Chat với shop */}
      {showChat && (
        <Modal title="Chat với shop" onClose={() => setShowChat(false)}>
          <div>Chức năng chat sẽ cập nhật sau.</div>
        </Modal>
      )}
      {/* Hỗ trợ khách hàng */}
      {showSupport && (
        <Modal title="Hỗ trợ khách hàng" onClose={() => setShowSupport(false)}>
          <div>Liên hệ: 1800-xxxx (miễn phí) hoặc email: support@shopee.edu.vn</div>
        </Modal>
      )}
      {/* Đánh giá sản phẩm */}
      {showReview && (
        <Modal title="Đánh giá sản phẩm" onClose={() => setShowReview(false)}>
          <div>Chức năng đánh giá sẽ cập nhật sau.</div>
        </Modal>
      )}
      {/* Lưới sản phẩm */}
      <div style={{ maxWidth: 1200, margin: '0 auto', marginBottom: 24, fontFamily: 'Garamond, serif' }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: '#ff5722', margin: '0 0 16px 0', letterSpacing: 1, textAlign: 'left', fontFamily: 'Garamond, serif' }}>Sản phẩm nổi bật</h2>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#ff9800', fontWeight: 700, fontSize: 20, padding: 32, fontFamily: 'Garamond, serif' }}>Đang tải sản phẩm...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 24, fontFamily: 'Garamond, serif' }}>
            {filteredProducts.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#bbb', fontWeight: 600, fontSize: 18, fontFamily: 'Garamond, serif' }}>
                <p>Không tìm thấy sản phẩm phù hợp.</p>
              </div>
            ) : (
              filteredProducts.map((product: Product) => {
                const hasBought = Array.isArray(history) && history.some((p: Product) => p.id === product.id);
                return (
                  <div key={product.id} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #ff980033', padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'stretch', border: '1px solid #ffe0b2', transition: 'box-shadow .2s', position: 'relative', minHeight: 340, fontFamily: 'Garamond, serif' }}>
                    <div style={{ width: '100%', height: 160, marginBottom: 10, background: '#fff3e0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontFamily: 'Garamond, serif' }}>
                      {product.imageUrls && product.imageUrls.length > 0 ? (
                        <img src={product.imageUrls[0]} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                      ) : (
                        <span style={{ color: '#bbb' }}>Không có ảnh</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, fontFamily: 'Garamond, serif' }}>
                      <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: '#ff5722', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Garamond, serif' }}>{product.name}</h3>
                      <span style={{ color: '#ff9800', fontWeight: 900, fontSize: 17, marginLeft: 8, fontFamily: 'Garamond, serif' }}>{formatPrice(product.price)}</span>
                    </div>
                    <p style={{ color: '#666', fontSize: 14, margin: '4px 0 10px 0', minHeight: 36, flex: 1, fontFamily: 'Garamond, serif' }}>{product.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#888', marginBottom: 8, fontFamily: 'Garamond, serif' }}>
                      <span>
                        Số lượng: {product.stock}
                        {product.stock === 0 && (
                          <span style={{ color: '#ff5722', fontWeight: 700 }}> (Hết hàng)</span>
                        )}
                      </span>
                      {product.imageUrls.length > 0 && (
                        <span style={{ color: '#ff9800', fontWeight: 700 }}>
                          📷 {product.imageUrls.length} ảnh
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                      <button style={{ width: '100%', background: '#ff9800', color: '#fff', border:'1px solid #ff9800', borderRadius:6, padding:'10px 0', fontWeight:700, fontSize:15, cursor:'pointer', fontFamily:'Garamond, serif'}} onClick={() => addToCart(product)}>
                        Thêm vào giỏ
                      </button>
                      <button style={{ width: '100%', background: '#ff5722', color: '#fff', border:'1px solid #ff9800', borderRadius:6, padding:'10px 0', fontWeight:700, fontSize:15, cursor:'pointer', fontFamily:'Garamond, serif'}} onClick={() => buyNow(product)}>
                        Mua ngay
                      </button>
                      {hasBought && (
                        <button style={{ width: '100%', border:'1px solid #ff9800', borderRadius:6, padding:'10px 0', fontWeight:700, fontSize:15, cursor:'pointer', fontFamily:'Garamond, serif'}} onClick={() => setShowReview(true)}>
                          Đánh giá
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </BaseLayout>
  );
}

const inputStyle = {
  border: '1px solid #ccc', borderRadius: 6, padding: '8px 12px', fontSize: 15, fontFamily: 'Garamond, serif'
};

const menuBtnStyle = {
  background: '#fff',
  color: '#ff5722',
  border: '1.5px solid #ff9800',
  borderRadius: 8,
  padding: '12px 18px',
  fontWeight: 700,
  fontSize: 17,
  cursor: 'pointer',
  fontFamily: 'Garamond, serif',
  marginBottom: 2,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  transition: 'background .2s, color .2s, border .2s',
  boxShadow: '0 2px 8px #ff980022',
};
const iconStyle = {
  fontSize: 22,
  marginRight: 6,
};
