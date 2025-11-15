// Dashboard API for pharmacy management
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function getPharmacyStock(pharmacyId: string, token: string) {
  try {
    const response = await fetch(`${API_BASE}/dashboard/stock`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch stock');
  } catch (error) {
    console.error('Error fetching stock:', error);
    throw error;
  }
}

export async function updateStock(
  pharmacyId: string,
  medicineId: string,
  quantity: number,
  priceRWF: number,
  token: string
) {
  try {
    const response = await fetch(`${API_BASE}/dashboard/stock`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ medicineId, quantity, priceRWF }),
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to update stock');
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
}

export async function getPharmacyOrders(token: string) {
  try {
    const response = await fetch(`${API_BASE}/dashboard/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error('Failed to fetch orders');
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

