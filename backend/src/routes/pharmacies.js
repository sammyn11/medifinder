import express from 'express';
import { pharmacies } from '../data.js';

export const pharmaciesRouter = express.Router();

// GET /api/pharmacies - Search pharmacies
pharmaciesRouter.get('/', (req, res) => {
  try {
    const { q, loc, insurance } = req.query;
    let results = [...pharmacies];

    // Filter by location
    if (loc) {
      results = results.filter(p => 
        p.sector.toLowerCase().includes(loc.toLowerCase())
      );
    }

    // Filter by insurance
    if (insurance) {
      results = results.filter(p => 
        p.accepts.map(a => a.toLowerCase()).includes(insurance.toLowerCase())
      );
    }

    // Filter by medicine name (search in stocks)
    if (q) {
      results = results.filter(p => 
        p.stocks.some(s => 
          s.name.toLowerCase().includes(q.toLowerCase())
        )
      );
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search pharmacies', message: error.message });
  }
});

// GET /api/pharmacies/:id - Get single pharmacy
pharmaciesRouter.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const pharmacy = pharmacies.find(p => p.id === id);

    if (!pharmacy) {
      return res.status(404).json({ error: 'Pharmacy not found' });
    }

    res.json(pharmacy);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get pharmacy', message: error.message });
  }
});
