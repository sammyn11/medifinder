import { getDb } from '../database/db.js';

export function getPharmacyStock(pharmacyId) {
  const db = getDb();
  
  const stocks = db.prepare(`
    SELECT 
      ps.id as stockId,
      m.id as medicineId,
      m.name as name,
      m.strength as strength,
      m.requires_prescription as requiresPrescription,
      ps.price_rwf as priceRWF,
      ps.quantity as quantity
    FROM pharmacy_stocks ps
    JOIN medicines m ON ps.medicine_id = m.id
    WHERE ps.pharmacy_id = ?
    ORDER BY m.name
  `).all(pharmacyId);
  
  return stocks.map(stock => ({
    id: `med-${stock.medicineId}`,
    stockId: stock.stockId,
    medicineId: stock.medicineId,
    name: stock.name,
    strength: stock.strength || undefined,
    priceRWF: stock.priceRWF,
    requiresPrescription: stock.requiresPrescription === 1,
    quantity: stock.quantity
  }));
}

export function updateStock(pharmacyId, medicineId, quantity, priceRWF) {
  const db = getDb();
  
  // Check if stock exists
  const stock = db.prepare(`
    SELECT id FROM pharmacy_stocks 
    WHERE pharmacy_id = ? AND medicine_id = ?
  `).get(pharmacyId, medicineId);
  
  if (!stock) {
    throw new Error('Stock not found');
  }
  
  // Update stock
  db.prepare(`
    UPDATE pharmacy_stocks 
    SET quantity = ?, price_rwf = ?
    WHERE pharmacy_id = ? AND medicine_id = ?
  `).run(quantity, priceRWF, pharmacyId, medicineId);
  
  return getPharmacyStock(pharmacyId);
}

export function getPharmacyOrders(pharmacyId, status = null) {
  const db = getDb();
  
  let query = `
    SELECT 
      o.*,
      GROUP_CONCAT(
        m.name || ' (' || oi.quantity || 'x)'
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN medicines m ON oi.medicine_id = m.id
    WHERE o.pharmacy_id = ?
  `;
  
  const params = [pharmacyId];
  
  if (status) {
    query += ' AND o.status = ?';
    params.push(status);
  }
  
  query += ' GROUP BY o.id ORDER BY o.created_at DESC';
  
  const orders = db.prepare(query).all(...params);
  
  // Get order items for each order
  return orders.map(order => {
    const items = db.prepare(`
      SELECT 
        oi.quantity,
        oi.price_rwf,
        m.name as medicine_name,
        m.strength as medicine_strength
      FROM order_items oi
      JOIN medicines m ON oi.medicine_id = m.id
      WHERE oi.order_id = ?
    `).all(order.id);
    
    return {
      id: order.id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      items: items.map(item => 
        `${item.medicine_name}${item.medicine_strength ? ` ${item.medicine_strength}` : ''} x ${item.quantity}`
      ),
      itemDetails: items,
      total: order.total_rwf,
      status: order.status,
      prescriptionStatus: order.prescription_status,
      delivery: order.delivery === 1,
      address: order.delivery_address,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    };
  });
}

export function updateOrderStatus(pharmacyId, orderId, status) {
  const db = getDb();
  
  // Verify order belongs to pharmacy
  const order = db.prepare('SELECT id FROM orders WHERE id = ? AND pharmacy_id = ?').get(orderId, pharmacyId);
  if (!order) {
    throw new Error('Order not found');
  }
  
  // Update order status
  db.prepare(`
    UPDATE orders 
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND pharmacy_id = ?
  `).run(status, orderId, pharmacyId);
  
  return getPharmacyOrders(pharmacyId);
}

export function updatePrescriptionStatus(pharmacyId, orderId, prescriptionStatus) {
  const db = getDb();
  
  // Verify order belongs to pharmacy
  const order = db.prepare('SELECT id FROM orders WHERE id = ? AND pharmacy_id = ?').get(orderId, pharmacyId);
  if (!order) {
    throw new Error('Order not found');
  }
  
  // Update prescription status
  db.prepare(`
    UPDATE orders 
    SET prescription_status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND pharmacy_id = ?
  `).run(prescriptionStatus, orderId, pharmacyId);
  
  return getPharmacyOrders(pharmacyId);
}

export function getPharmacyIdFromUser(userId) {
  const db = getDb();
  const user = db.prepare('SELECT pharmacy_id FROM users WHERE id = ?').get(userId);
  return user?.pharmacy_id || null;
}
