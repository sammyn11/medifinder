import { useState } from 'react';
import type { StockItem } from '@/services/dashboardApi';

interface StockRowProps {
  stock: StockItem;
  onUpdate: (medicineId: number, quantity: number, price: number) => void;
  updating: boolean;
}

export function StockRow({ stock, onUpdate, updating }: StockRowProps) {
  const [quantity, setQuantity] = useState(stock.quantity);
  const [price, setPrice] = useState(stock.priceRWF);
  const [hasChanges, setHasChanges] = useState(false);

  function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newQuantity = Number(e.target.value);
    setQuantity(newQuantity);
    setHasChanges(newQuantity !== stock.quantity || price !== stock.priceRWF);
  }

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newPrice = Number(e.target.value);
    setPrice(newPrice);
    setHasChanges(quantity !== stock.quantity || newPrice !== stock.priceRWF);
  }

  function handleUpdate() {
    if (hasChanges && !updating) {
      onUpdate(stock.medicineId, quantity, price);
      setHasChanges(false);
    }
  }

  function handleBlur() {
    if (hasChanges) {
      handleUpdate();
    }
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="p-3 font-medium text-gray-900">{stock.name}</td>
      <td className="p-3 text-gray-600">{stock.strength || '-'}</td>
      <td className="p-3">
        <input
          type="number"
          min="0"
          value={quantity}
          onChange={handleQuantityChange}
          onBlur={handleBlur}
          disabled={updating}
          className="w-20 border rounded px-2 py-1 text-sm disabled:opacity-50"
        />
      </td>
      <td className="p-3">
        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={handlePriceChange}
          onBlur={handleBlur}
          disabled={updating}
          className="w-24 border rounded px-2 py-1 text-sm disabled:opacity-50"
        />
      </td>
      <td className="p-3">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          stock.requiresPrescription
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {stock.requiresPrescription ? 'Required' : 'No'}
        </span>
      </td>
      <td className="p-3">
        <button
          onClick={handleUpdate}
          disabled={!hasChanges || updating}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updating ? 'Updating...' : hasChanges ? 'Update' : 'Saved'}
        </button>
      </td>
    </tr>
  );
}
