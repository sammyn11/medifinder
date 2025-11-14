import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getPharmacy } from '@/services/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export function QuickOrder() {
  const { pharmacyId, medicineId } = useParams<{ pharmacyId: string; medicineId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [pharmacy, setPharmacy] = useState<any>(null);
  const [medicine, setMedicine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [delivery, setDelivery] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const addToCart = useCartStore(s => s.add);

  // Get medicine name from URL params if available
  const medicineName = searchParams.get('name') || '';

  useEffect(() => {
    if (!pharmacyId) {
      setError('Pharmacy ID is required');
      setLoading(false);
      return;
    }

    getPharmacy(pharmacyId).then(p => {
      if (!p) {
        setError('Pharmacy not found');
        setLoading(false);
        return;
      }

      setPharmacy(p);

      // Find the medicine in pharmacy stocks
      const medId = medicineId || medicineName;
      if (medId) {
        // Try to find by stock ID first, then by medicine name
        let foundMed = p.stocks.find((s: any) => s.id === medId);
        
        // If not found by ID, try by name
        if (!foundMed && medicineName) {
          foundMed = p.stocks.find((s: any) => 
            s.name.toLowerCase().includes(medicineName.toLowerCase()) ||
            `${s.name} ${s.strength || ''}`.toLowerCase().includes(medicineName.toLowerCase())
          );
        }

        // If still not found, try by any partial match
        if (!foundMed) {
          foundMed = p.stocks.find((s: any) => 
            s.name.toLowerCase().includes(medId.toLowerCase()) ||
            `${s.name} ${s.strength || ''}`.toLowerCase().includes(medId.toLowerCase())
          );
        }

        if (foundMed) {
          setMedicine(foundMed);
        } else {
          setError('Medicine not found in this pharmacy');
        }
      } else {
        setError('Medicine not specified');
      }

      setLoading(false);
    }).catch(err => {
      setError('Failed to load pharmacy details');
      setLoading(false);
    });
  }, [pharmacyId, medicineId, medicineName]);

  const handleOrder = () => {
    if (!medicine || !pharmacy) return;

    if (medicine.quantity < quantity) {
      setError(`Only ${medicine.quantity} available in stock`);
      return;
    }

    // Add to cart
    addToCart({
      pharmacyId: pharmacy.id,
      medicineId: medicine.id,
      name: `${medicine.name} ${medicine.strength || ''}`.trim(),
      priceRWF: medicine.priceRWF,
      quantity: quantity,
      requiresPrescription: medicine.requiresPrescription,
      delivery: delivery,
      deliveryAddress: delivery ? deliveryAddress : undefined
    });

    // Navigate to cart
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !pharmacy || !medicine) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="card text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Process Order</h2>
            <p className="text-gray-600 mb-6">{error || 'Medicine or pharmacy not found'}</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => navigate('/pharmacies')} className="btn-primary">
                Search Again
              </button>
              <button onClick={() => navigate('/')} className="btn-secondary">
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = medicine.priceRWF * quantity;
  const inStock = medicine.quantity > 0;
  const canOrder = inStock && quantity > 0 && quantity <= medicine.quantity;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-8">
        <div className="max-w-3xl mx-auto px-4">
          <button 
            onClick={() => navigate(-1)}
            className="mb-4 text-white/90 hover:text-white flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Quick Order</h1>
          <p className="text-primary-100">Order {medicine.name} from {pharmacy.name}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Pharmacy Info Card */}
        <div className="card mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{pharmacy.name}</h2>
              <p className="text-gray-600">📍 {pharmacy.sector}</p>
              {pharmacy.phone && (
                <p className="text-gray-600 mt-1">📞 {pharmacy.phone}</p>
              )}
            </div>
            {pharmacy.delivery && (
              <span className="bg-pharmacy-100 text-pharmacy-700 px-3 py-1 rounded-full text-sm font-semibold">
                🚚 Delivery Available
              </span>
            )}
          </div>
        </div>

        {/* Medicine Details Card */}
        <div className="card mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {medicine.name}
                {medicine.strength && (
                  <span className="text-lg font-normal text-gray-600 ml-2">
                    {medicine.strength}
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  inStock 
                    ? 'bg-pharmacy-100 text-pharmacy-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {inStock ? `✓ ${medicine.quantity} in stock` : 'Out of stock'}
                </span>
                {medicine.requiresPrescription && (
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
                    📋 Prescription Required
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary-600">
                {medicine.priceRWF.toLocaleString()} RWF
              </p>
              <p className="text-sm text-gray-500">per unit</p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="border-t pt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max={medicine.quantity}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setQuantity(Math.min(Math.max(1, val), medicine.quantity));
                }}
                className="w-20 text-center border-2 border-gray-300 rounded-lg py-2 font-semibold text-lg"
              />
              <button
                onClick={() => setQuantity(Math.min(medicine.quantity, quantity + 1))}
                disabled={quantity >= medicine.quantity}
                className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
              <span className="text-gray-600 ml-4">
                Max: {medicine.quantity} available
              </span>
            </div>
          </div>

          {/* Delivery Option */}
          {pharmacy.delivery && (
            <div className="border-t pt-4 mt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={delivery}
                  onChange={(e) => setDelivery(e.target.checked)}
                  className="w-5 h-5 text-primary-600 rounded border-gray-300"
                />
                <span className="text-sm font-semibold text-gray-700">
                  🚚 Request Home Delivery
                </span>
              </label>
              {delivery && (
                <div className="mt-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your delivery address..."
                    className="input-field w-full h-24"
                    required={delivery}
                  />
                </div>
              )}
            </div>
          )}

          {/* Total Price */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">Total:</span>
              <span className="text-3xl font-bold text-primary-600">
                {totalPrice.toLocaleString()} RWF
              </span>
            </div>
          </div>
        </div>

        {/* Order Button */}
        <div className="space-y-4">
          {!user && (
            <div className="card bg-yellow-50 border-2 border-yellow-200">
              <p className="text-sm text-yellow-800">
                💡 <strong>Tip:</strong> You can order without an account, but creating an account helps track your orders.
            </p>
            </div>
          )}

          <button
            onClick={handleOrder}
            disabled={!canOrder || (delivery && !deliveryAddress.trim())}
            className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {canOrder ? (
              <>🛒 Add to Cart & Continue Shopping</>
            ) : (
              <>Cannot Order - {inStock ? 'Invalid quantity' : 'Out of stock'}</>
            )}
          </button>

          <button
            onClick={() => navigate(`/pharmacies/${pharmacy.id}`)}
            className="btn-secondary w-full border-primary-600 text-primary-600 hover:bg-primary-50"
          >
            View All Medicines from {pharmacy.name}
          </button>
        </div>
      </div>
    </div>
  );
}
