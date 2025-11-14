import express from 'express';
import { createUser, authenticateUser } from '../services/userService.js';

export const authRouter = express.Router();

// POST /api/auth/signup - Register new user
authRouter.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Validation error', 
        message: 'Name, email, and password are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Validation error', 
        message: 'Password must be at least 6 characters' 
      });
    }

    const result = await createUser({ name, email, password, phone });
    res.status(201).json(result);
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.message === 'User already exists') {
      return res.status(409).json({ 
        error: 'User already exists', 
        message: 'An account with this email already exists' 
      });
    }
    
    res.status(500).json({ 
      error: 'Signup failed', 
      message: error.message 
    });
  }
});

// POST /api/auth/login - Login user
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Validation error', 
        message: 'Email and password are required' 
      });
    }

    const result = await authenticateUser(email, password);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ 
        error: 'Authentication failed', 
        message: 'Invalid email or password' 
      });
    }
    
    res.status(500).json({ 
      error: 'Login failed', 
      message: error.message 
    });
  }
});
