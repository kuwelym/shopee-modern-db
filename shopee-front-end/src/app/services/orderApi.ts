const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function createOrder(token: string, order: { items: any[]; total: number }) {
  const res = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error('Không thể tạo đơn hàng');
  return res.json();
}

export async function fetchOrders(token: string) {
  const res = await fetch(`${API_BASE_URL}/api/orders`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Không thể lấy danh sách đơn hàng');
  return res.json();
}
