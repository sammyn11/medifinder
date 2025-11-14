import { getDatabase } from './schema.js';

let db = null;

export function getDb() {
  if (!db) {
    db = getDatabase();
  }
  return db;
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
