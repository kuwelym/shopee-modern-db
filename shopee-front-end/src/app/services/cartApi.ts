const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function fetchCart(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/cart`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Không thể lấy giỏ hàng');
  return res.json();
}

export async function addToCart(token: string, product: any, quantity: number = 1) {
  const res = await fetch(`${API_BASE_URL}/api/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify({
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.price,
    }),
  });
  if (!res.ok) throw new Error('Không thể thêm vào giỏ hàng');
  return res.json();
}

export async function removeFromCart(token: string, productId: string) {
  const res = await fetch(`${API_BASE_URL}/api/cart/remove/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng');
  return res.json();
}

export async function clearCart(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/cart/clear`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Không thể xóa giỏ hàng');
  return res;
}

export async function updateCartItemQuantity(token: string, productId: string, quantity: number) {
  const res = await fetch(`${API_BASE_URL}/api/cart/update-quantity`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) throw new Error('Không thể cập nhật số lượng');
  return res.json();
}
