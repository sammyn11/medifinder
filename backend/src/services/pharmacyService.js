import { getDb } from '../database/db.js';

export function searchPharmacies(params) {
  const db = getDb();
  const { q, loc, insurance } = params;
  
  let query = `
    SELECT DISTINCT 
      p.*,
      GROUP_CONCAT(DISTINCT it.name) as accepts
    FROM pharmacies p
    LEFT JOIN pharmacy_insurance pi ON p.id = pi.pharmacy_id
    LEFT JOIN insurance_types it ON pi.insurance_id = it.id
    WHERE 1=1
  `;
  
  const conditions = [];
  const values = [];
  
  if (loc) {
    conditions.push('p.sector LIKE ?');
    values.push(`%${loc}%`);
  }
  
  if (insurance) {
    conditions.push('it.name LIKE ?');
    values.push(`%${insurance}%`);
  }
  
  if (conditions.length > 0) {
    query += ' AND ' + conditions.join(' AND ');
  }
  
  query += ' GROUP BY p.id';
  
  let pharmacies = db.prepare(query).all(...values);
  
  // Filter by medicine name if provided
  if (q) {
    const searchQuery = `
      SELECT DISTINCT ps.pharmacy_id
      FROM pharmacy_stocks ps
      JOIN medicines m ON ps.medicine_id = m.id
      WHERE m.name LIKE ?
    `;
    const pharmacyIds = db.prepare(searchQuery).all(`%${q}%`).map(row => row.pharmacy_id);
    pharmacies = pharmacies.filter(p => pharmacyIds.includes(p.id));
  }
  
  // Format results
  return pharmacies.map(pharmacy => formatPharmacy(db, pharmacy));
}

export function getPharmacyById(id) {
  const db = getDb();
  
  const pharmacy = db.prepare(`
    SELECT 
      p.*,
      GROUP_CONCAT(DISTINCT it.name) as accepts
    FROM pharmacies p
    LEFT JOIN pharmacy_insurance pi ON p.id = pi.pharmacy_id
    LEFT JOIN insurance_types it ON pi.insurance_id = it.id
    WHERE p.id = ?
    GROUP BY p.id
  `).get(id);
  
  if (!pharmacy) {
    return null;
  }
  
  return formatPharmacy(db, pharmacy);
}

function formatPharmacy(db, pharmacy) {
  // Get stocks
  const stocks = db.prepare(`
    SELECT 
      m.id as medicineId,
      m.name as name,
      m.strength as strength,
      m.requires_prescription as requiresPrescription,
      ps.price_rwf as priceRWF,
      ps.quantity as quantity
    FROM pharmacy_stocks ps
    JOIN medicines m ON ps.medicine_id = m.id
    WHERE ps.pharmacy_id = ?
  `).all(pharmacy.id);
  
  return {
    id: pharmacy.id,
    name: pharmacy.name,
    sector: pharmacy.sector,
    address: pharmacy.address,
    phone: pharmacy.phone,
    delivery: pharmacy.delivery === 1,
    lat: pharmacy.lat,
    lng: pharmacy.lng,
    description: pharmacy.description,
    accepts: pharmacy.accepts ? pharmacy.accepts.split(',') : [],
    stocks: stocks.map(stock => ({
      id: `med-${stock.medicineId}`,
      name: stock.name,
      strength: stock.strength || undefined,
      priceRWF: stock.priceRWF,
      requiresPrescription: stock.requiresPrescription === 1,
      quantity: stock.quantity
    }))
  };
}
