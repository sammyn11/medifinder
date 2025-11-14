import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { 
  getPharmacyStock, 
  updateStockItem, 
  getPharmacyOrders, 
  updateOrderStatus,
  updatePrescriptionStatus,
  type StockItem,
  type Order
} from '@/services/dashboardApi';
import { StockRow } from './StockRow';

export function PharmacyDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'stock'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'orders') {
        const ordersData = await getPharmacyOrders();
        setOrders(ordersData);
      } else {
        const stockData = await getPharmacyStock();
        setStock(stockData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateOrderStatus(orderId: string, newStatus: Order['status']) {
    setUpdating(orderId);
    try {
      const updatedOrders = await updateOrderStatus(orderId, newStatus);
      setOrders(updatedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
    } finally {
      setUpdating(null);
    }
  }

  async function handleUpdatePrescriptionStatus(orderId: string, newStatus: Order['prescriptionStatus']) {
    setUpdating(orderId);
    try {
      const updatedOrders = await updatePrescriptionStatus(orderId, newStatus);
      setOrders(updatedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update prescription status');
    } finally {
      setUpdating(null);
    }
  }

  async function handleUpdateStock(medicineId: number, quantity: number, price: number) {
    setUpdating(`stock-${medicineId}`);
    try {
      const updatedStock = await updateStockItem(medicineId, quantity, price);
      setStock(updatedStock);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update stock');
    } finally {
      setUpdating(null);
    }
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-primary-100 text-primary-800';
      case 'ready': return 'bg-pharmacy-100 text-pharmacy-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">🏥 Pharmacy Dashboard</h1>
              <p className="text-primary-100">
                {user ? `Welcome, ${user.name}` : 'Manage your pharmacy operations'}
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/" className="btn-secondary bg-white/20 text-white border-white hover:bg-white/30">
                Back to Home
              </Link>
              <button
                onClick={handleLogout}
                className="btn-secondary bg-white/20 text-white border-white hover:bg-white/30"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
            <button 
              onClick={() => setError(null)} 
              className="ml-4 text-red-500 hover:text-red-700 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-4 border-b">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'orders'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('stock')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'stock'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              💊 Stock Management ({stock.length})
            </button>
          </div>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {loading ? (
              <div className="card text-center py-12">
                <div className="text-gray-500">Loading orders...</div>
              </div>
            ) : orders.length === 0 ? (
              <div className="card text-center py-12">
                <div className="text-gray-500">No orders yet. Orders will appear here when customers place them.</div>
              </div>
            ) : (
              orders.map((order) => (
              <div key={order.id} className="card">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">Order {order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      {order.prescriptionStatus === 'pending' && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                          ⏳ Prescription Pending
                        </span>
                      )}
                      {order.prescriptionStatus === 'verified' && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-pharmacy-100 text-pharmacy-800">
                          ✓ Prescription Verified
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><span className="font-semibold">Customer:</span> {order.customerName}</p>
                      <p><span className="font-semibold">Items:</span> {order.items.join(', ')}</p>
                      <p><span className="font-semibold">Total:</span> {order.total.toLocaleString()} RWF</p>
                      <p><span className="font-semibold">Delivery:</span> {order.delivery ? `Yes - ${order.address}` : 'No (Pickup)'}</p>
                      <p><span className="font-semibold">Created:</span> {order.createdAt}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {order.prescriptionStatus === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdatePrescriptionStatus(order.id, 'verified')}
                          disabled={updating === order.id}
                          className="btn-primary text-sm py-2 disabled:opacity-50"
                        >
                          {updating === order.id ? 'Updating...' : '✓ Verify Prescription'}
                        </button>
                        <button
                          onClick={() => handleUpdatePrescriptionStatus(order.id, 'rejected')}
                          disabled={updating === order.id}
                          className="btn-secondary border-red-600 text-red-600 hover:bg-red-50 text-sm py-2 disabled:opacity-50"
                        >
                          ✗ Reject Prescription
                        </button>
                      </>
                    )}
                    {order.status === 'pending' && order.prescriptionStatus === 'verified' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                        disabled={updating === order.id}
                        className="btn-primary text-sm py-2 disabled:opacity-50"
                      >
                        {updating === order.id ? 'Updating...' : 'Confirm Order'}
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                        disabled={updating === order.id}
                        className="btn-primary text-sm py-2 disabled:opacity-50"
                      >
                        {updating === order.id ? 'Updating...' : 'Start Processing'}
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                        disabled={updating === order.id}
                        className="btn-primary text-sm py-2 bg-pharmacy-600 hover:bg-pharmacy-700 disabled:opacity-50"
                      >
                        {updating === order.id ? 'Updating...' : 'Mark Ready'}
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                        disabled={updating === order.id}
                        className="btn-primary text-sm py-2 disabled:opacity-50"
                      >
                        {updating === order.id ? 'Updating...' : 'Mark Delivered'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
            )}
          </div>
        )}

        {/* Stock Tab */}
        {activeTab === 'stock' && (
          <div className="space-y-4">
            {loading ? (
              <div className="card text-center py-12">
                <div className="text-gray-500">Loading stock...</div>
              </div>
            ) : stock.length === 0 ? (
              <div className="card text-center py-12">
                <div className="text-gray-500">No stock available. Your pharmacy account needs to be linked to a pharmacy record.</div>
              </div>
            ) : (
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Medicine Stock</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-3 text-sm font-semibold text-gray-700">Medicine</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-700">Strength</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-700">Quantity</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-700">Price (RWF)</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-700">Prescription</th>
                        <th className="text-left p-3 text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {stock.map((med) => (
                        <StockRow 
                          key={med.id} 
                          stock={med} 
                          onUpdate={handleUpdateStock}
                          updating={updating === `stock-${med.medicineId}`}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="card bg-primary-50 border-2 border-primary-200">
              <h3 className="font-bold text-gray-900 mb-2">💡 Quick Tips</h3>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Update stock quantities as medicines are sold or restocked</li>
                <li>Adjust prices when needed to reflect current market rates</li>
                <li>Verify prescriptions before confirming orders</li>
                <li>Update order status as you process each order</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

