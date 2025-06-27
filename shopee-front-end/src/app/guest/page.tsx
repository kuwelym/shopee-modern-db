
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useProducts } from "../pages/products/hooks";
import BaseLayout from "../components/BaseLayout";
import { useRouter } from "next/navigation";

export default function GuestPage() {
  const { products, loading, searchQuery, setSearchQuery, handleSearch, clearSearch, formatPrice } = useProducts();
  const [filter, setFilter] = useState({ inStock: false, minPrice: "", maxPrice: "" });
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Không tự động chuyển hướng sang buyer khi đã đăng nhập
  // Chỉ chuyển hướng khi bấm nút Đăng nhập

  const filteredProducts = products.filter((product) => {
    if (filter.inStock && product.stock === 0) return false;
    if (filter.minPrice && product.price < Number(filter.minPrice)) return false;
    if (filter.maxPrice && product.price > Number(filter.maxPrice)) return false;
    return true;
  });



  return (
    <BaseLayout
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onSearch={handleSearch}
      onClearSearch={clearSearch}
      showSearch={true}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', marginBottom: 48, fontFamily: 'Garamond, serif', position: 'relative' }}>
        <button
          onClick={() => router.push('/pages/auth/login')}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            background: '#ff5722',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '8px 20px',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            margin: 16,
            zIndex: 10,
            fontFamily: 'Garamond, serif',
            boxShadow: '0 2px 8px #ff980033',
            transition: 'background .2s',
          }}
        >
          Đăng nhập
        </button>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: '#ff5722', margin: '0 0 24px 0', letterSpacing: 1, textAlign: 'left', fontFamily: 'Garamond, serif' }}>Sản phẩm nổi bật</h2>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#ff9800', fontWeight: 700, fontSize: 20, padding: 32, fontFamily: 'Garamond, serif' }}>Đang tải sản phẩm...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 24, fontFamily: 'Garamond, serif' }}>
            {filteredProducts.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#bbb', fontWeight: 600, fontSize: 18, fontFamily: 'Garamond, serif' }}>
                <p>Không tìm thấy sản phẩm phù hợp.</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
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
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
