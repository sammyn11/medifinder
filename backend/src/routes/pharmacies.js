import express from 'express';
import { searchPharmacies, getPharmacyById } from '../services/pharmacyService.js';

export const pharmaciesRouter = express.Router();

// GET /api/pharmacies - Search pharmacies
pharmaciesRouter.get('/', (req, res) => {
  try {
    const { q, loc, insurance } = req.query;
    const results = searchPharmacies({ q, loc, insurance });
    res.json(results);
  } catch (error) {
    console.error('Error searching pharmacies:', error);
    res.status(500).json({ error: 'Failed to search pharmacies', message: error.message });
  }
});

// GET /api/pharmacies/:id - Get single pharmacy
pharmaciesRouter.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const pharmacy = getPharmacyById(id);

    if (!pharmacy) {
      return res.status(404).json({ error: 'Pharmacy not found' });
    }

    res.json(pharmacy);
  } catch (error) {
    console.error('Error getting pharmacy:', error);
    res.status(500).json({ error: 'Failed to get pharmacy', message: error.message });
  }
});
