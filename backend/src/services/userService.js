import { getDb } from '../database/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'medifinder-secret-key-change-in-production';

export async function createUser(userData) {
  const db = getDb();
  const { name, email, password, phone } = userData;
  
  // Check if user exists
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    throw new Error('User already exists');
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create user ID
  const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Insert user
  db.prepare(`
    INSERT INTO users (id, email, name, phone, password, role)
    VALUES (?, ?, ?, ?, ?, 'user')
  `).run(id, email, name, phone || null, hashedPassword);
  
  // Get created user
  const user = db.prepare('SELECT id, email, name, phone, role, created_at FROM users WHERE id = ?').get(id);
  
  // Generate token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  return {
    user: {
      ...user,
      createdAt: user.created_at
    },
    token
  };
}

export async function authenticateUser(email, password) {
  const db = getDb();
  
  // Get user
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }
  
  // Generate token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      createdAt: user.created_at
    },
    token
  };
}

export function findUserByEmail(email) {
  const db = getDb();
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

export function findUserById(id) {
  const db = getDb();
  return db.prepare('SELECT id, email, name, phone, role, created_at FROM users WHERE id = ?').get(id);
}
