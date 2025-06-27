import React from "react";
import { useRouter } from "next/navigation";

interface BaseLayoutProps {
  children: React.ReactNode;
  role?: string;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onClearSearch?: () => void;
  showSearch?: boolean;
  extraButtons?: React.ReactNode;
}

export default function BaseLayout({
  children,
  role,
  onSearch,
  searchQuery = "",
  setSearchQuery,
  onClearSearch,
  showSearch = true,
  extraButtons
}: BaseLayoutProps) {
  const router = useRouter();
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #fff 0%, #fff5e6 100%)', fontFamily: 'Garamond, serif' }}>
      <div style={{ width: '100%', background: '#fffbe7', textAlign: 'center', padding: '10px 0 6px 0', borderBottom: '1px solid #ffe0b2' }}>
        <span style={{ color: '#b71c1c', fontWeight: 600, fontSize: 15 }}>
          Đây là trang web học thuật, không nhằm mục đích thương mại.
        </span>
      </div>
      <header style={{ background: '#ff5722', color: '#fff', padding: '0', marginBottom: 0, boxShadow: '0 2px 12px #ff572233', borderBottom: '2px solid #ff9800', fontFamily: 'Garamond, serif' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: 1, color: '#fff', fontFamily: 'Garamond, serif' }}>Shopee</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {extraButtons}
            {role ? null : (
              <button onClick={() => router.push('/pages/auth/login')} style={{ background: '#fff', color: '#ff5722', border: 'none', borderRadius: 6, padding: '10px 32px', fontWeight: 800, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px #ff980033', transition: 'background .2s', marginRight: 8, fontFamily: 'Garamond, serif' }}>
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </header>
      {/* Nút chức năng truyền qua extraButtons, nằm trên thanh tìm kiếm */}
      {extraButtons && (
        <div style={{ maxWidth: 900, margin: '0 auto', marginTop: 24, marginBottom: 0, display: 'flex', justifyContent: 'flex-start' }}>
          {extraButtons}
        </div>
      )}
      {showSearch && (
        <div style={{ maxWidth: 900, margin: '0 auto', marginTop: 32, marginBottom: 32, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #ff980033', padding: 24, display: 'flex', alignItems: 'stretch', gap: 12, position: 'relative', zIndex: 2, fontFamily: 'Garamond, serif' }}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm, thương hiệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            style={{ flex: 1, borderRadius: 8, border: '2px solid #ff9800', padding: '14px 18px', fontSize: 18, outline: 'none', fontWeight: 500, fontFamily: 'Garamond, serif', height: '100%', minHeight: 52, boxSizing: 'border-box' }}
            onKeyPress={(e) => e.key === "Enter" && onSearch && onSearch(searchQuery)}
          />
          <button onClick={() => onSearch && onSearch(searchQuery)} style={{ background: 'linear-gradient(90deg, #ff9800 0%, #ff5722 100%)', color: '#fff', border: '2px solid #ff9800', borderRadius: 8, padding: '0 32px', fontWeight: 800, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px #ff980033', fontFamily: 'Garamond, serif', height: '100%', minHeight: 52, display: 'flex', alignItems: 'center' }}>
            Tìm kiếm
          </button>
          {searchQuery && onClearSearch && (
            <button onClick={onClearSearch} style={{ background: '#eee', color: '#ff9800', border: 'none', borderRadius: 8, padding: '0 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: 'Garamond, serif', height: '100%', minHeight: 52, display: 'flex', alignItems: 'center' }}>
              Xóa
            </button>
          )}
        </div>
      )}
      {children}
      <footer style={{ margin: '0', padding: '32px 0 0 0', borderTop: '1px solid #ffe0b2', textAlign: 'center', color: '#ff9800', fontWeight: 700, fontSize: 16, background: '#fffbe7', fontFamily: 'Garamond, serif' }}>
        © 2025 Shopee Modern. Mua sắm dễ dàng, an toàn và tiện lợi.
      </footer>
    </div>
  );
}
