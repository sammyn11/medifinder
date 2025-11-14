import { User } from '@/store/authStore';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface StockItem {
  id: string;
  stockId: number;
  medicineId: number;
  name: string;
  strength?: string;
  priceRWF: number;
  requiresPrescription: boolean;
  quantity: number;
}

export interface OrderItem {
  quantity: number;
  price_rwf: number;
  medicine_name: string;
  medicine_strength?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: string[];
  itemDetails: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  prescriptionStatus: 'pending' | 'verified' | 'rejected';
  delivery: boolean;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('auth-storage');
  if (token) {
    try {
      const parsed = JSON.parse(token);
      if (parsed.state?.token) {
        return {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parsed.state.token}`
        };
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
  return {
    'Content-Type': 'application/json'
  };
}

export async function getPharmacyStock(): Promise<StockItem[]> {
  try {
    const response = await fetch(`${API_BASE}/dashboard/stock`, {
      headers: getAuthHeaders()
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    if (response.status === 401 || response.status === 403) {
      throw new Error('Authentication required');
    }
    
    throw new Error('Failed to fetch stock');
  } catch (error) {
    console.error('Error fetching stock:', error);
    throw error;
  }
}

export async function updateStockItem(medicineId: number, quantity: number, priceRWF: number): Promise<StockItem[]> {
  try {
    const response = await fetch(`${API_BASE}/dashboard/stock/${medicineId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity, priceRWF })
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    if (response.status === 401 || response.status === 403) {
      throw new Error('Authentication required');
    }
    
    throw new Error('Failed to update stock');
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
}

export async function getPharmacyOrders(status?: string): Promise<Order[]> {
  try {
    const url = status 
      ? `${API_BASE}/dashboard/orders?status=${status}`
      : `${API_BASE}/dashboard/orders`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    if (response.status === 401 || response.status === 403) {
      throw new Error('Authentication required');
    }
    
    throw new Error('Failed to fetch orders');
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order[]> {
  try {
    const response = await fetch(`${API_BASE}/dashboard/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    if (response.status === 401 || response.status === 403) {
      throw new Error('Authentication required');
    }
    
    throw new Error('Failed to update order status');
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

export async function updatePrescriptionStatus(orderId: string, prescriptionStatus: Order['prescriptionStatus']): Promise<Order[]> {
  try {
    const response = await fetch(`${API_BASE}/dashboard/orders/${orderId}/prescription`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ prescriptionStatus })
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    if (response.status === 401 || response.status === 403) {
      throw new Error('Authentication required');
    }
    
    throw new Error('Failed to update prescription status');
  } catch (error) {
    console.error('Error updating prescription status:', error);
    throw error;
  }
}
