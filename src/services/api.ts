import { pharmacies, Pharmacy } from './data';
import { User } from '@/store/authStore';

export interface SearchParams {
  q?: string;
  loc?: string;
  insurance?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export async function searchPharmacies(params: SearchParams): Promise<Pharmacy[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params.q) queryParams.set('q', params.q);
    if (params.loc) queryParams.set('loc', params.loc);
    if (params.insurance) queryParams.set('insurance', params.insurance);
    
    const response = await fetch(`${API_BASE}/pharmacies?${queryParams.toString()}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('API unavailable, using mock data', error);
  }
  
  // Fallback to mock data
  const { q, loc, insurance } = params;
  let results = pharmacies;
  if (loc) {
    results = results.filter(p => p.sector.toLowerCase().includes(loc.toLowerCase()));
  }
  if (insurance) {
    results = results.filter(p => p.accepts.map(a => a.toLowerCase()).includes(insurance.toLowerCase()));
  }
  if (q) {
    results = results.filter(p => p.stocks.some(s => s.name.toLowerCase().includes(q.toLowerCase())));
  }
  await new Promise(r => setTimeout(r, 200));
  return results;
}

export async function getPharmacy(id: string): Promise<Pharmacy | undefined> {
  try {
    const response = await fetch(`${API_BASE}/pharmacies/${id}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('API unavailable, using mock data', error);
  }
  
  await new Promise(r => setTimeout(r, 150));
  return pharmacies.find(p => p.id === id);
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (response.ok) {
      return await response.json();
    }
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  } catch (error) {
    if (error instanceof Error && error.message !== 'Login failed') {
      throw error;
    }
    console.warn('API unavailable, using mock authentication', error);
  }
  
  await new Promise(r => setTimeout(r, 500));
  
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  const user: User = {
    id: `user-${Date.now()}`,
    email,
    name: email.split('@')[0],
    role: 'user',
  };
  
  const token = `mock-token-${Date.now()}`;
  
  return { user, token };
}

export async function signupUser(
  name: string,
  email: string,
  password: string,
  phone?: string,
  role: 'user' | 'pharmacy' = 'user'
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, phone, role }),
    });
    
    if (response.ok) {
      return await response.json();
    }
    const error = await response.json();
    throw new Error(error.message || 'Signup failed');
  } catch (error) {
    if (error instanceof Error && error.message !== 'Signup failed') {
      throw error;
    }
    console.warn('API unavailable, using mock authentication', error);
  }
  
  await new Promise(r => setTimeout(r, 500));
  
  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  const user: User = {
    id: role === 'pharmacy' ? `pharmacy-${Date.now()}` : `user-${Date.now()}`,
    email,
    name,
    phone,
    role,
  };
  
  const token = `mock-token-${Date.now()}`;
  
  return { user, token };
}

