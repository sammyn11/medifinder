import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getPharmacyStock, updateStock, getPharmacyOrders } from '@/services/dashboardApi';

export function PharmacyDashboard() {
  const { user, token } = useAuthStore();
  const [stock, setStock] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stock' | 'orders'>('stock');

  useEffect(() => {
    if (token && user) {
      loadData();
    }
  }, [token, user]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [stockData, ordersData] = await Promise.all([
        getPharmacyStock('', token).catch(() => []),
        getPharmacyOrders(token).catch(() => [])
      ]);
      setStock(stockData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (medicineId: string, quantity: number, priceRWF: number) => {
    if (!token) return;
    try {
      await updateStock('', medicineId, quantity, priceRWF, token);
      loadData();
    } catch (error) {
      alert('Failed to update stock');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-pharmacy-600 to-pharmacy-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">🏥 Pharmacy Dashboard</h1>
          <p className="text-pharmacy-100">Manage your pharmacy operations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('stock')}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === 'stock'
                  ? 'border-pharmacy-600 text-pharmacy-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Stock Management
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === 'orders'
                  ? 'border-pharmacy-600 text-pharmacy-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Orders ({orders.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pharmacy-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : activeTab === 'stock' ? (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Medicine Stock</h2>
            {stock.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No stock data available. Please contact support to set up your inventory.</p>
            ) : (
              <div className="space-y-4">
                {stock.map((item: any) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">Current: {item.quantity} units</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary-600">{item.priceRWF?.toLocaleString()} RWF</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No orders yet. Orders will appear here when customers place them.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Order #{order.id.slice(0, 8)}</h3>
                        <p className="text-sm text-gray-600">{order.customer_name}</p>
                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary-600">{order.total_rwf?.toLocaleString()} RWF</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'completed' ? 'bg-pharmacy-100 text-pharmacy-700' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

