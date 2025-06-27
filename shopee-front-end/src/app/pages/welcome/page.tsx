'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './style.module.scss';
import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';

export default function Welcome() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user && user.userType === 'BUYER') {
      router.push('/buyer');
    }
    if (!isLoading && !user) {
      router.push('/pages/auth/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/pages/auth/login');
  };

  if (isLoading) {
    return (
      <div className={styles.homeContainer}>
        <div className={styles.hero}><p>Loading...</p></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className={styles.homeContainer} style={{ background: 'linear-gradient(135deg, #fffbe7 0%, #fff 100%)', minHeight: '100vh' }}>
      <header className={styles.hero} style={{ background: 'linear-gradient(90deg, #ff9800 0%, #ff5722 100%)', color: '#fff', borderRadius: 24, margin: '32px auto 0 auto', maxWidth: 900, boxShadow: '0 4px 24px #ff980033', padding: '48px 32px 32px 32px', textAlign: 'center' }}>
        <img src="/vercel.svg" alt="Shopee Modern" style={{ width: 80, height: 80, background: '#fff', borderRadius: '50%', marginBottom: 16, boxShadow: '0 2px 8px #0001' }} />
        <h1 style={{ fontSize: 40, fontWeight: 900, margin: 0, color: '#fff' }}>Shopee Modern</h1>
        <p style={{ fontSize: 22, color: '#fffde7', margin: '12px 0 24px 0', fontWeight: 500 }}>Mua sắm thông minh, trải nghiệm hiện đại!</p>
        <div className={styles.heroActions} style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 12 }}>
          {user.userType === 'BUYER' && (
            <Link href="/pages/products">
              <button className={styles.primaryBtn} style={{ background: '#fff', color: '#ff9800', fontWeight: 800, fontSize: 18, borderRadius: 8, padding: '12px 32px', boxShadow: '0 2px 8px #ff980033' }}>Khám phá sản phẩm</button>
            </Link>
          )}
          {user.userType === 'SHOP' && (
            <Link href="/pages/shop/products">
              <button className={styles.primaryBtn} style={{ background: '#fff', color: '#ff9800', fontWeight: 800, fontSize: 18, borderRadius: 8, padding: '12px 32px', boxShadow: '0 2px 8px #ff980033' }}>Quản lý sản phẩm</button>
            </Link>
          )}
          <button onClick={handleLogout} className={styles.logoutButton} style={{ background: '#fff', color: '#ff5722', fontWeight: 800, fontSize: 18, borderRadius: 8, padding: '12px 32px', boxShadow: '0 2px 8px #ff980033' }}>
            Đăng xuất
          </button>
        </div>
      </header>
      <section className={styles.features} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32, margin: '48px auto', maxWidth: 1000 }}>
        <div className={styles.featureCard} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #ff980033', padding: 32, minWidth: 220, textAlign: 'center' }}>
          <span style={{ fontSize: 32 }}>🔎</span>
          <h3 style={{ color: '#ff9800', fontWeight: 800, fontSize: 20 }}>Tìm kiếm & Lọc thông minh</h3>
          <p style={{ color: '#555', fontSize: 15 }}>Dễ dàng tìm sản phẩm bạn muốn với bộ lọc hiện đại.</p>
        </div>
        <div className={styles.featureCard} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #ff980033', padding: 32, minWidth: 220, textAlign: 'center' }}>
          <span style={{ fontSize: 32 }}>⚡</span>
          <h3 style={{ color: '#ff9800', fontWeight: 800, fontSize: 20 }}>Giao diện mượt mà</h3>
          <p style={{ color: '#555', fontSize: 15 }}>Thiết kế responsive, tối ưu cho mọi thiết bị.</p>
        </div>
        <div className={styles.featureCard} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #ff980033', padding: 32, minWidth: 220, textAlign: 'center' }}>
          <span style={{ fontSize: 32 }}>🛍️</span>
          <h3 style={{ color: '#ff9800', fontWeight: 800, fontSize: 20 }}>Giỏ hàng tiện lợi</h3>
          <p style={{ color: '#555', fontSize: 15 }}>Thêm, sửa, xóa sản phẩm nhanh chóng, đồng bộ mọi lúc.</p>
        </div>
        <div className={styles.featureCard} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #ff980033', padding: 32, minWidth: 220, textAlign: 'center' }}>
          <span style={{ fontSize: 32 }}>🔒</span>
          <h3 style={{ color: '#ff9800', fontWeight: 800, fontSize: 20 }}>Bảo mật & Đăng nhập dễ dàng</h3>
          <p style={{ color: '#555', fontSize: 15 }}>Thông tin cá nhân và đơn hàng luôn được bảo vệ.</p>
        </div>
      </section>
      <footer className={styles.footer} style={{ margin: '48px 0 0 0', padding: '24px 0 0 0', borderTop: '1px solid #eee', textAlign: 'center', color: '#ff9800', fontWeight: 700, fontSize: 16 }}>
        © 2025 Shopee Modern. Mua sắm dễ dàng, an toàn và tiện lợi.
      </footer>
    </div>
  );
}
