import express from 'express';
import cors from 'cors';
import { pharmaciesRouter } from './routes/pharmacies.js';
import { authRouter } from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'MediFinder API is running' });
});

// API Documentation endpoint
app.get('/api-docs', (req, res) => {
  res.json({
    message: 'MediFinder API Documentation',
    version: '1.0.0',
    baseUrl: `http://localhost:${PORT}/api`,
    endpoints: {
      health: {
        method: 'GET',
        path: '/health',
        description: 'Check if the API server is running'
      },
      pharmacies: {
        getAll: {
          method: 'GET',
          path: '/api/pharmacies',
          description: 'Search and filter pharmacies',
          queryParams: ['q', 'loc', 'insurance']
        },
        getById: {
          method: 'GET',
          path: '/api/pharmacies/:id',
          description: 'Get single pharmacy details'
        }
      },
      auth: {
        signup: {
          method: 'POST',
          path: '/api/auth/signup',
          description: 'Register a new user',
          body: {
            name: 'string (required)',
            email: 'string (required)',
            password: 'string (required, min 6 chars)',
            phone: 'string (optional)'
          }
        },
        login: {
          method: 'POST',
          path: '/api/auth/login',
          description: 'Login with email and password',
          body: {
            email: 'string (required)',
            password: 'string (required)'
          }
        }
      }
    },
    documentation: 'See README.md or API_DOCS.md for complete documentation'
  });
});

// API Routes
app.use('/api/pharmacies', pharmaciesRouter);
app.use('/api/auth', authRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MediFinder API server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});
