import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../../data/medifinder.db');

export function initializeDatabase() {
  const db = new Database(dbPath);
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create pharmacies table
  db.exec(`
    CREATE TABLE IF NOT EXISTS pharmacies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      sector TEXT NOT NULL,
      address TEXT,
      phone TEXT,
      delivery BOOLEAN DEFAULT 0,
      lat REAL,
      lng REAL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create insurance_types table
  db.exec(`
    CREATE TABLE IF NOT EXISTS insurance_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create pharmacy_insurance table (many-to-many relationship)
  db.exec(`
    CREATE TABLE IF NOT EXISTS pharmacy_insurance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pharmacy_id TEXT NOT NULL,
      insurance_id INTEGER NOT NULL,
      FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id) ON DELETE CASCADE,
      FOREIGN KEY (insurance_id) REFERENCES insurance_types(id) ON DELETE CASCADE,
      UNIQUE(pharmacy_id, insurance_id)
    )
  `);

  // Create medicines table
  db.exec(`
    CREATE TABLE IF NOT EXISTS medicines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      strength TEXT,
      requires_prescription BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create pharmacy_stocks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS pharmacy_stocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pharmacy_id TEXT NOT NULL,
      medicine_id INTEGER NOT NULL,
      price_rwf REAL NOT NULL,
      quantity INTEGER DEFAULT 0,
      FOREIGN KEY (pharmacy_id) REFERENCES pharmacies(id) ON DELETE CASCADE,
      FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
      UNIQUE(pharmacy_id, medicine_id)
    )
  `);

  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      phone TEXT,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create indexes for better query performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_pharmacy_sector ON pharmacies(sector);
    CREATE INDEX IF NOT EXISTS idx_stock_pharmacy ON pharmacy_stocks(pharmacy_id);
    CREATE INDEX IF NOT EXISTS idx_stock_medicine ON pharmacy_stocks(medicine_id);
    CREATE INDEX IF NOT EXISTS idx_medicine_name ON medicines(name);
  `);

  return db;
}

export function getDatabase() {
  const dbPath = join(__dirname, '../../data/medifinder.db');
  return new Database(dbPath);
}
